export default function DreamCard({ dream, onEdit, onDelete, onAnalyze, readonly, analyzing }) {
  return (
    <div className="dream-card">
      <div className="dream-card-header">
        <span className="dream-card-title">{dream.title}</span>
        <span className="dream-card-date">{dream.date}</span>
      </div>
      <div className="dream-card-content">{dream.content}</div>
      {dream.tags?.length > 0 && (
        <div className="dream-card-tags">
          {dream.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}
      {!readonly && (
        <div className="dream-card-actions">
          <button className="btn btn-secondary btn-small" onClick={() => onEdit(dream)}>编辑</button>
          <button className="btn btn-secondary btn-small" onClick={() => onDelete(dream.id)}>删除</button>
          {!dream.analysis && (
            <button className="btn btn-primary btn-small" onClick={() => onAnalyze(dream.id)} disabled={analyzing}>
              {analyzing ? '分析中...' : 'AI 分析'}
            </button>
          )}
        </div>
      )}
      {dream.analysis && (
        <div className="analysis-box">
          <h4>AI 分析结果</h4>
          <div className="analysis-item">情绪：{dream.analysis.emotion}（强度：{dream.analysis.emotionScore}）</div>
          <div className="analysis-item">主题：{dream.analysis.themes?.join('、')}</div>
          {dream.analysis.symbols?.length > 0 && (
            <div className="analysis-item">
              象征解读：
              <ul className="symbol-list">
                {dream.analysis.symbols.map((s, i) => (
                  <li key={i}><strong>{s.name}</strong>：{s.meaning}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="analysis-item">
            关键词：{dream.analysis.keywords?.join('、')}
          </div>
          <div className="analysis-summary" style={{ marginTop: '0.5rem' }}>
            {dream.analysis.summary}
          </div>
        </div>
      )}
    </div>
  );
}
