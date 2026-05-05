import { useEffect, useState } from 'react';

export default function RecoveryRing({ score, size = 200, strokeWidth = 14 }) {
  const [animated, setAnimated] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * radius;
  const color = score >= 67 ? '#2ef88b' : score >= 34 ? '#f5a623' : '#ef4444';
  const label = score >= 67 ? 'OPTIMAL' : score >= 34 ? 'MODERATE' : 'POOR';
  const offset = circ - (animated / 100) * circ;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#1e1e1e" strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.3s' }}
        />
        {/* Glow */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth + 8}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          opacity={0.12}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 2,
      }}>
        <span style={{ fontSize: 44, fontWeight: 800, color, letterSpacing: '-2px', lineHeight: 1 }}>
          {score}%
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: '2px', opacity: 0.8 }}>
          {label}
        </span>
        <span style={{ fontSize: 11, color: '#666', marginTop: 2 }}>RECOVERY</span>
      </div>
    </div>
  );
}
