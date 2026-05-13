import { useState, useEffect } from 'react';
import DreamCard from '../components/DreamCard';

const API = '/api';

export default function CalendarPage() {
  const [dreams, setDreams] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/dreams?month=${currentMonth}`)
      .then(r => r.json())
      .then(setDreams)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentMonth]);

  const [year, month] = currentMonth.split('-').map(Number);
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date().toISOString().slice(0, 10);

  const dreamDates = new Set(dreams.map(d => d.date));
  const selectedDreams = selectedDate
    ? dreams.filter(d => d.date === selectedDate)
    : [];

  const prevMonth = () => {
    const d = new Date(year, month - 2, 1);
    setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    setSelectedDate(null);
  };

  const nextMonth = () => {
    const d = new Date(year, month, 1);
    setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    setSelectedDate(null);
  };

  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

  if (loading) return <div className="loading">加载日历...</div>;

  return (
    <div className="calendar-layout">
      <div className="calendar-left">
        <div className="chart-section">
          <div className="calendar-header">
            <div className="calendar-nav">
              <button className="btn btn-secondary btn-small" onClick={prevMonth}>&lt;</button>
              <h3>{year} 年 {month} 月</h3>
              <button className="btn btn-secondary btn-small" onClick={nextMonth}>&gt;</button>
            </div>
          </div>
          <div className="calendar-grid">
            {weekdays.map(w => (
              <div key={w} className="calendar-weekday">{w}</div>
            ))}
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`empty-${i}`} className="calendar-day empty" />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = String(i + 1).padStart(2, '0');
              const dateStr = `${currentMonth}-${day}`;
              const hasDream = dreamDates.has(dateStr);
              const isSelected = selectedDate === dateStr;
              return (
                <div
                  key={day}
                  className={`calendar-day ${dateStr === today ? 'today' : ''} ${hasDream ? 'has-dream' : ''}`}
                  style={isSelected ? { background: 'var(--accent)', color: 'white' } : {}}
                  onClick={() => setSelectedDate(dateStr)}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="calendar-right">
        {selectedDate ? (
          <>
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-light)' }}>
              {selectedDate} 的梦境
            </h3>
            {selectedDreams.length === 0 ? (
              <div className="empty-state">
                <p>这天没有梦境记录</p>
              </div>
            ) : (
              <div className="dream-list">
                {selectedDreams.map(dream => (
                  <DreamCard
                    key={dream.id}
                    dream={dream}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    onAnalyze={() => {}}
                    readonly
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <p>点击左侧日期查看梦境</p>
          </div>
        )}
      </div>
    </div>
  );
}
