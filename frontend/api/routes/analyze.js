import { Router } from 'express';
import Dream from '../models/Dream.js';

const router = Router();

router.post('/:id', async (req, res) => {
  try {
    const dream = await Dream.findById(req.params.id);
    if (!dream) return res.status(404).json({ error: '梦境不存在' });

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: '未配置 DEEPSEEK_API_KEY' });
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-v4-pro',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `你是一位专业的梦境分析师。请分析以下梦境，返回 JSON 格式结果（不要返回 markdown 代码块，直接返回 JSON）：

梦境标题：${dream.title}
梦境内容：${dream.content}
日期：${dream.date}

请返回以下格式的 JSON：
{
  "emotion": "主要情绪（如：焦虑、喜悦、恐惧、平静等）",
  "emotionScore": 0.7,
  "themes": ["主题1", "主题2"],
  "symbols": [
    { "name": "象征物", "meaning": "解读" }
  ],
  "summary": "一段简短的梦境分析总结",
  "keywords": ["关键词1", "关键词2", "关键词3", "关键词4", "关键词5"]
}`,
        }],
      }),
    });

    const data = await response.json();
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const text = data.choices[0].message.content;
    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        return res.status(500).json({ error: 'AI 返回格式异常' });
      }
    }

    dream.analysis = analysis;
    await dream.save();
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: '分析失败: ' + err.message });
  }
});

router.get('/keywords', async (req, res) => {
  try {
    const dreams = await Dream.find({ 'analysis.keywords': { $exists: true, $ne: [] } });
    const keywordCount = {};

    dreams.forEach(d => {
      d.analysis.keywords.forEach(kw => {
        keywordCount[kw] = (keywordCount[kw] || 0) + 1;
      });
    });

    const result = Object.entries(keywordCount)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/mood-trend', async (req, res) => {
  try {
    const dreams = await Dream.find({ 'analysis.emotion': { $exists: true } }).sort({ date: 1 });
    const moodMap = {
      '喜悦': 0.9, '开心': 0.9, '快乐': 0.9,
      '平静': 0.7, '安宁': 0.7, '放松': 0.7,
      '中性': 0.5,
      '焦虑': 0.3, '紧张': 0.3, '压力': 0.3,
      '恐惧': 0.1, '害怕': 0.1, '噩梦': 0.1,
      '悲伤': 0.2, '难过': 0.2, '失落': 0.2,
    };

    const trend = dreams
      .filter(d => d.analysis?.emotion)
      .map(d => ({
        date: d.date,
        score: d.analysis.emotionScore ?? moodMap[d.analysis.emotion] ?? 0.5,
        emotion: d.analysis.emotion,
      }));

    res.json(trend);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
