export default function ProgressBar({ value, max, color = '#2ef88b', height = 6, label, labelRight }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      {(label || labelRight) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          {label && <span style={{ fontSize: 12, color: '#888' }}>{label}</span>}
          {labelRight && <span style={{ fontSize: 12, color: '#888' }}>{labelRight}</span>}
        </div>
      )}
      <div style={{ background: '#1e1e1e', borderRadius: height, height, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: color,
          borderRadius: height,
          transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: `0 0 8px ${color}44`,
        }} />
      </div>
    </div>
  );
}
