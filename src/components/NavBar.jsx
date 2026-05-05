const tabs = [
  { key: 'dashboard', icon: '⚡', label: 'Overview' },
  { key: 'sleep',     icon: '🌙', label: 'Sleep' },
  { key: 'strain',    icon: '🏋️', label: 'Strain' },
  { key: 'nutrition', icon: '🍽️', label: 'Food' },
  { key: 'therapy',   icon: '🌡️', label: 'Therapy' },
  { key: 'peptides',  icon: '💉', label: 'Peptides' },
  { key: 'journal',   icon: '📋', label: 'Journal' },
  { key: 'trends',    icon: '📈', label: 'Trends' },
];

export default function NavBar({ active, onChange }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      background: 'rgba(8,8,8,0.95)',
      borderTop: '1px solid #1e1e1e',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      zIndex: 100,
      padding: '8px 6px 12px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {tabs.map(tab => {
          const isActive = active === tab.key;
          return (
            <button key={tab.key} onClick={() => onChange(tab.key)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              background: 'none', padding: '6px 4px',
              flex: 1,
              opacity: isActive ? 1 : 0.45,
              transition: 'all 0.2s',
            }}>
              <span style={{
                fontSize: isActive ? 22 : 20,
                filter: isActive ? 'none' : 'grayscale(0.4)',
                transition: 'all 0.2s',
              }}>{tab.icon}</span>
              <span style={{
                fontSize: 8, fontWeight: isActive ? 700 : 500,
                color: isActive ? '#2ef88b' : '#666',
                letterSpacing: '0.3px', textTransform: 'uppercase',
              }}>{tab.label}</span>
              {isActive && (
                <div style={{ width: 16, height: 2, borderRadius: 2, background: '#2ef88b', marginTop: 1 }} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
