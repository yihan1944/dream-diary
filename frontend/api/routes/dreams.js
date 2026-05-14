import { Router } from 'express';
import Dream from '../models/Dream.js';
import RateLimit from '../models/RateLimit.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { date, month } = req.query;
    const filter = {};
    if (date) filter.date = date;
    else if (month) filter.date = { $regex: `^${month}` };

    const dreams = await Dream.find(filter).sort({ date: -1 });
    res.json(dreams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const dream = await Dream.findById(req.params.id);
    if (!dream) return res.status(404).json({ error: '梦境不存在' });
    res.json(dream);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, content, date, tags } = req.body;
    if (!content) {
      return res.status(400).json({ error: '梦境内容不能为空' });
    }
    const ip = req.ip || req.socket?.remoteAddress || 'vercel';

    const bucket = `${ip}_${new Date().toISOString().slice(0, 10)}`;
    const counter = await RateLimit.findOneAndUpdate(
      { bucket },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
    if (counter.count > 10) {
      await RateLimit.updateOne({ bucket }, { $inc: { count: -1 } });
      return res.status(429).json({ error: '今日提交已达上限（10条），请明天再来' });
    }

    const dream = await Dream.create({ title: title || '梦境', content, date, tags, clientIp: ip });
    res.status(201).json(dream);

    if (!title) {
      generateTitle(dream._id, content);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function generateTitle(dreamId, content) {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) return;

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-v4-pro',
        max_tokens: 64,
        messages: [{
          role: 'user',
          content: `请为以下梦境内容生成一个简短的标题，不超过10个字，直接返回标题文本，不要加引号、换行或任何修饰。\n\n梦境内容：${content}`,
        }],
      }),
    });

    const data = await response.json();
    if (data.error) return;

    const generatedTitle = (data.choices[0].message.content || '').trim().slice(0, 10);
    await Dream.findByIdAndUpdate(dreamId, { title: generatedTitle });
  } catch {
    // title generation failure is non-critical
  }
}

router.put('/:id', async (req, res) => {
  try {
    const { title, content, date, tags } = req.body;
    const update = {};
    if (title) update.title = title;
    if (content) update.content = content;
    if (date) update.date = date;
    if (tags) update.tags = tags;

    const dream = await Dream.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!dream) return res.status(404).json({ error: '梦境不存在' });
    res.json(dream);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const dream = await Dream.findByIdAndDelete(req.params.id);
    if (!dream) return res.status(404).json({ error: '梦境不存在' });
    res.json({ message: '已删除' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/admin/clear-limits', async (req, res) => {
  if (req.body.key !== 'dream-clean-2026') {
    return res.status(403).json({ error: '无权访问' });
  }
  await RateLimit.deleteMany({});
  res.json({ message: '已清理' });
});

export default router;
