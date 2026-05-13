import { useState, useEffect } from 'react';

export default function DreamForm({ onSave, editing, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setContent(editing.content);
      setDate(editing.date);
      setTags(editing.tags?.join(', ') || '');
    } else {
      setTitle('');
      setContent('');
      setDate(new Date().toISOString().slice(0, 10));
      setTags('');
    }
  }, [editing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSave({
      title: title.trim(),
      content: content.trim(),
      date,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    if (!editing) {
      setTitle('');
      setContent('');
      setTags('');
    }
  };

  return (
    <form className="dream-form" onSubmit={handleSubmit}>
      <h2>{editing ? '编辑梦境' : '记录新梦境'}</h2>
      <div className="form-group">
        <label>标题</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="给你的梦取个名字..."
        />
      </div>
      <div className="form-group">
        <label>日期</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>梦境内容</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="描述你梦到了什么..."
        />
      </div>
      <div className="form-group">
        <label>标签（逗号分隔）</label>
        <input
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="飞行, 水, 家人..."
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editing ? '保存修改' : '记录梦境'}
        </button>
        {editing && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            取消
          </button>
        )}
      </div>
    </form>
  );
}
