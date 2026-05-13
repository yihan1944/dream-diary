import { Router } from 'express';
import Dream from '../models/Dream.js';

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
    if (!title || !content) {
      return res.status(400).json({ error: '标题和内容不能为空' });
    }
    const dream = await Dream.create({ title, content, date, tags });
    res.status(201).json(dream);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

export default router;
