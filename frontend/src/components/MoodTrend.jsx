import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function MoodTrend({ data }) {
  if (!data.length) return null;

  return (
    <div className="chart-section">
      <h3>情绪趋势</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <XAxis dataKey="date" tick={{ fill: '#a0a0b0', fontSize: 12 }} />
            <YAxis
              domain={[0, 1]}
              tick={{ fill: '#a0a0b0', fontSize: 12 }}
              tickFormatter={v => {
                if (v <= 0.2) return '恐惧';
                if (v <= 0.4) return '焦虑';
                if (v <= 0.6) return '中性';
                if (v <= 0.8) return '平静';
                return '喜悦';
              }}
            />
            <Tooltip
              contentStyle={{
                background: '#16213e',
                border: '1px solid #2a2a4a',
                borderRadius: 8,
                color: '#e0e0e0',
              }}
              formatter={(value, name, props) => [
                `${props.payload.emotion} (${value.toFixed(2)})`,
                '情绪',
              ]}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#7b68ee"
              strokeWidth={2}
              dot={{ fill: '#7b68ee', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
