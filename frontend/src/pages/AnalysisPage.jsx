import { useState, useEffect } from 'react';
import KeywordChart from '../components/KeywordChart';
import MoodTrend from '../components/MoodTrend';

import { API } from '../api';

export default function AnalysisPage() {
  const [keywords, setKeywords] = useState([]);
  const [moodTrend, setMoodTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/analyze/keywords`).then(r => r.json()),
      fetch(`${API}/analyze/mood-trend`).then(r => r.json()),
    ])
      .then(([kw, mt]) => {
        setKeywords(kw);
        setMoodTrend(mt);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">加载分析数据...</div>;

  return (
    <div>
      <KeywordChart keywords={keywords} />
      <MoodTrend data={moodTrend} />
      {keywords.length === 0 && moodTrend.length === 0 && (
        <div className="empty-state">
          <p>还没有分析数据，请先在日记页面对梦境进行 AI 分析</p>
        </div>
      )}
    </div>
  );
}
