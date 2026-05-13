import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function KeywordChart({ keywords }) {
  if (!keywords.length) return null;

  return (
    <div className="chart-section">
      <h3>关键词频率</h3>
      <div className="keyword-cloud">
        {keywords.map(kw => (
          <span
            key={kw.text}
            className="keyword-item"
            style={{ fontSize: `${Math.min(0.7 + kw.value * 0.3, 1.8)}rem` }}
          >
            {kw.text}
          </span>
        ))}
      </div>
      <div className="chart-container" style={{ marginTop: '1rem' }}>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={keywords.slice(0, 15)}>
            <XAxis dataKey="text" tick={{ fill: '#a0a0b0', fontSize: 12 }} />
            <YAxis tick={{ fill: '#a0a0b0', fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: '#16213e',
                border: '1px solid #2a2a4a',
                borderRadius: 8,
                color: '#e0e0e0',
              }}
            />
            <Bar dataKey="value" fill="#7b68ee" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
