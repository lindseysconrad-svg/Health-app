export default function MetricPill({ icon, label, value, unit, color = '#f0f0f0', sub }) {
  return (
    <div style={{
      background: '#111',
      border: '1px solid #1e1e1e',
      borderRadius: 14,
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      flex: 1,
      minWidth: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 11, color: '#666', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 26, fontWeight: 800, color, letterSpacing: '-1px', lineHeight: 1 }}>
          {value}
        </span>
        {unit && <span style={{ fontSize: 12, color: '#666', fontWeight: 500 }}>{unit}</span>}
      </div>
      {sub && <span style={{ fontSize: 11, color: '#555' }}>{sub}</span>}
    </div>
  );
}
