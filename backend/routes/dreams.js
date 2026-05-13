import { Router } from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_FILE = join(__dirname, '..', 'data', 'dreams.json');

function loadDreams() {
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveDreams(dreams) {
  writeFileSync(DATA_FILE, JSON.stringify(dreams, null, 2), 'utf-8');
}

router.get('/', (req, res) => {
  const dreams = loadDreams();
  const { date, month } = req.query;

  let filtered = dreams;
  if (date) {
    filtered = dreams.filter(d => d.date === date);
  } else if (month) {
    filtered = dreams.filter(d => d.date.startsWith(month));
  }

  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(filtered);
});

router.get('/:id', (req, res) => {
  const dreams = loadDreams();
  const dream = dreams.find(d => d.id === req.params.id);
  if (!dream) return res.status(404).json({ error: '梦境不存在' });
  res.json(dream);
});

router.post('/', (req, res) => {
  const { title, content, date, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: '标题和内容不能为空' });
  }

  const dreams = loadDreams();
  const newDream = {
    id: uuidv4(),
    title,
    content,
    date: date || new Date().toISOString().slice(0, 10),
    tags: tags || [],
    analysis: null,
    createdAt: new Date().toISOString(),
  };

  dreams.push(newDream);
  saveDreams(dreams);
  res.status(201).json(newDream);
});

router.put('/:id', (req, res) => {
  const dreams = loadDreams();
  const idx = dreams.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: '梦境不存在' });

  const { title, content, date, tags } = req.body;
  dreams[idx] = { ...dreams[idx], ...(title && { title }), ...(content && { content }), ...(date && { date }), ...(tags && { tags }) };

  saveDreams(dreams);
  res.json(dreams[idx]);
});

router.delete('/:id', (req, res) => {
  let dreams = loadDreams();
  const idx = dreams.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: '梦境不存在' });

  dreams.splice(idx, 1);
  saveDreams(dreams);
  res.json({ message: '已删除' });
});

export default router;
