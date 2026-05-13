import { useState, useEffect } from 'react';
import DreamCard from '../components/DreamCard';

const API = '/api';

export default function MyDreamsPage() {
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDream, setEditingDream] = useState(null);
  const [analyzingId, setAnalyzingId] = useState(null);

  const fetchDreams = async () => {
    try {
      const res = await fetch(`${API}/dreams`);
      const data = await res.json();
      setDreams(data);
    } catch {
      console.error('Failed to load dreams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDreams(); }, []);

  const handleSave = async (dreamData) => {
    const res = await fetch(`${API}/dreams/${editingDream.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dreamData),
    });
    const updated = await res.json();
    setDreams(prev => prev.map(d => d.id === updated.id ? updated : d));
    setEditingDream(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('确定删除这条梦境记录吗？')) return;
    await fetch(`${API}/dreams/${id}`, { method: 'DELETE' });
    setDreams(prev => prev.filter(d => d.id !== id));
  };

  const handleAnalyze = async (id) => {
    setAnalyzingId(id);
    try {
      const res = await fetch(`${API}/analyze/${id}`, { method: 'POST' });
      const analysis = await res.json();
      setDreams(prev => prev.map(d => d.id === id ? { ...d, analysis } : d));
    } catch {
      alert('分析失败，请检查 DEEPSEEK_API_KEY 配置');
    } finally {
      setAnalyzingId(null);
    }
  };

  if (loading) return <div className="loading">加载中...</div>;

  return (
    <div>
      {editingDream && (
        <div className="dream-form">
          <h2>编辑梦境</h2>
          <div className="form-group">
            <label>标题</label>
            <input value={editingDream.title} onChange={e => setEditingDream({ ...editingDream, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label>日期</label>
            <input type="date" value={editingDream.date} onChange={e => setEditingDream({ ...editingDream, date: e.target.value })} />
          </div>
          <div className="form-group">
            <label>梦境内容</label>
            <textarea value={editingDream.content} onChange={e => setEditingDream({ ...editingDream, content: e.target.value })} />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={() => handleSave(editingDream)}>保存修改</button>
            <button className="btn btn-secondary" onClick={() => setEditingDream(null)}>取消</button>
          </div>
        </div>
      )}
      <div className="dream-list">
        {dreams.length === 0 ? (
          <div className="empty-state">
            <p>&#127769; 还没有梦境记录</p>
          </div>
        ) : (
          dreams.map(dream => (
            <DreamCard
              key={dream.id}
              dream={dream}
              onEdit={setEditingDream}
              onDelete={handleDelete}
              onAnalyze={handleAnalyze}
              analyzing={analyzingId === dream.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
