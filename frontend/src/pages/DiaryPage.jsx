import { useState } from 'react';
import DreamForm from '../components/DreamForm';

const API = '/api';

export default function DiaryPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = async (dreamData) => {
    await fetch(`${API}/dreams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dreamData),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <DreamForm onSave={handleSave} />
      {saved && <div className="success-msg">梦境已保存 &#10003;</div>}
    </div>
  );
}
