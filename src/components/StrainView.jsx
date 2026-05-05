import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { todayStats, strainHistory } from '../data/mockData';

const { strain } = todayStats;

const zoneColors = ['#3b82f6','#2ef88b','#f5a623','#ef4444','#7c3aed'];
const zoneLabels = ['Zone 1','Zone 2','Zone 3','Zone 4','Zone 5'];
const zoneDesc   = ['Warm-up','Easy','Aerobic','Threshold','Max'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: 10, padding: '8px 12px' }}>
      <p style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 12, color: '#f5a623', fontWeight: 600 }}>Strain: {payload[0]?.value}</p>
    </div>
  );
};

function ActivityDetail({ act }) {
  const total = Object.values(act.zones).reduce((a, b) => a + b, 0) || 1;
  return (
    <div className="card" style={{ marginBottom: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 26 }}>{act.icon}</span>
          <div>
            <p style={{ fontWeight: 800, fontSize: 16 }}>{act.name}</p>
            <p style={{ fontSize: 12, color: '#555' }}>{act.time} · {act.duration} min</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 22, fontWeight: 900, color: '#f5a623' }}>{act.strain}</p>
          <p style={{ fontSize: 11, color: '#555' }}>strain</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
        {[
          { label: 'Avg HR', val: act.avgHr, unit: 'bpm', color: '#ef4444' },
          { label: 'Max HR', val: act.maxHr, unit: 'bpm', color: '#ef4444' },
          { label: 'Calories', val: act.calories, unit: 'kcal', color: '#2ef88b' },
          ...(act.distance ? [{ label: 'Distance', val: act.distance + 'mi', unit: '', color: '#60a5fa' }] : []),
          ...(act.pace ? [{ label: 'Pace', val: act.pace, unit: '/mi', color: '#a78bfa' }] : []),
        ].map(m => (
          <div key={m.label} className="card2" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 10, color: '#555', fontWeight: 600, letterSpacing: '0.4px' }}>{m.label.toUpperCase()}</p>
            <p style={{ fontSize: 15, fontWeight: 800, color: m.color, marginTop: 4 }}>{m.val}<span style={{ fontSize: 9, color: '#555', marginLeft: 2 }}>{m.unit}</span></p>
          </div>
        ))}
      </div>

      {/* HR zones */}
      <p style={{ fontSize: 11, color: '#555', fontWeight: 600, letterSpacing: '0.5px', marginBottom: 8 }}>HEART RATE ZONES</p>
      <div style={{ display: 'flex', gap: 4, height: 24, borderRadius: 6, overflow: 'hidden', marginBottom: 8 }}>
        {Object.values(act.zones).map((min, i) => (
          min > 0 ? (
            <div key={i} style={{ flex: min, background: zoneColors[i], opacity: 0.85 }} title={`${zoneLabels[i]}: ${min}min`} />
          ) : null
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px' }}>
        {Object.values(act.zones).map((min, i) => min > 0 && (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: zoneColors[i] }} />
            <span style={{ fontSize: 11, color: '#666' }}>{zoneLabels[i]}: {min}min</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StrainView() {
  const strainColor = strain.score >= 14 ? '#ef4444' : strain.score >= 10 ? '#f5a623' : '#60a5fa';
  const chartData = strainHistory.map(d => ({ date: d.date.slice(5), strain: d.strain, calories: d.calories }));

  return (
    <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ padding: '20px 0 8px' }}>
        <p style={{ fontSize: 12, color: '#555', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Today</p>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>Strain & Activity</h1>
      </div>

      {/* Day strain score */}
      <div className="card animate-fade-up" style={{ textAlign: 'center', padding: '28px 24px' }}>
        <div style={{ fontSize: 72, fontWeight: 900, color: strainColor, letterSpacing: '-3px', lineHeight: 1 }}>
          {strain.score}
        </div>
        <p style={{ fontSize: 12, color: '#666', letterSpacing: '2px', marginTop: 4 }}>DAY STRAIN / 21</p>

        {/* Strain bar */}
        <div style={{ position: 'relative', height: 12, background: '#1e1e1e', borderRadius: 6, marginTop: 20, overflow: 'hidden' }}>
          <div style={{
            background: `linear-gradient(90deg, #60a5fa, #2ef88b, #f5a623, #ef4444)`,
            height: '100%', width: '100%', opacity: 0.3, borderRadius: 6,
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0,
            height: '100%', width: `${(strain.score / 21) * 100}%`,
            background: strainColor, borderRadius: 6,
            boxShadow: `0 0 10px ${strainColor}66`,
            transition: 'width 1s ease',
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 20 }}>
          <div>
            <p style={{ fontSize: 11, color: '#555', fontWeight: 600 }}>CALORIES</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#f0f0f0' }}>{strain.calories.toLocaleString()}</p>
          </div>
          <div>
            <p style={{ fontSize: 11, color: '#555', fontWeight: 600 }}>AVG HR</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#ef4444' }}>{strain.avgHr} bpm</p>
          </div>
          <div>
            <p style={{ fontSize: 11, color: '#555', fontWeight: 600 }}>MAX HR</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#ef4444' }}>{strain.maxHr} bpm</p>
          </div>
        </div>
      </div>

      {/* Activities */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="animate-fade-up">
        {strain.activities.map(act => <ActivityDetail key={act.id} act={act} />)}
      </div>

      {/* 7-day chart */}
      <div className="card animate-fade-up">
        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>7-Day Strain</p>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={chartData} barSize={24} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 21]} tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff06' }} />
            <Bar dataKey="strain" radius={[6,6,0,0]}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.strain >= 14 ? '#ef4444' : entry.strain >= 10 ? '#f5a623' : '#60a5fa'}
                  opacity={i === chartData.length - 1 ? 1 : 0.6}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8 }}>
          {[['#60a5fa','Light'],['#f5a623','Moderate'],['#ef4444','High']].map(([c,l]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: 'inline-block' }} />
              <span style={{ fontSize: 11, color: '#666' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
