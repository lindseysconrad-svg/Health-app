import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { todayStats, strainHistory } from '../data/mockData';

const { strain } = todayStats;

const zoneColors   = ['#3b82f6','#2ef88b','#f5a623','#ef4444','#7c3aed'];
const zoneLabels   = ['Z1 Warm-up','Z2 Easy','Z3 Aerobic','Z4 Threshold','Z5 Max'];
const zoneHRPcts   = ['50–60%','60–70%','70–80%','80–90%','90–100%'];
const zoneAdapts   = ['Base endurance','Fat oxidation','Lactate threshold','VO₂ development','Neuromuscular'];

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: 10, padding: '8px 12px' }}>
      <p style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 12, color: '#f5a623', fontWeight: 600 }}>Strain: {payload[0]?.value}</p>
    </div>
  );
};

function ZoneRow({ idx, minutes, pct, total }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: zoneColors[idx] }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#f0f0f0' }}>{zoneLabels[idx]}</span>
          <span style={{ fontSize: 10, color: '#444' }}>({zoneHRPcts[idx]} max HR)</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 11, color: zoneColors[idx], fontWeight: 700 }}>{minutes} min</span>
          <span style={{ fontSize: 11, color: '#555' }}>{pct}%</span>
        </div>
      </div>
      <div style={{ height: 6, background: '#1a1a1a', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: zoneColors[idx], borderRadius: 3, transition: 'width 1s ease', opacity: 0.85 }} />
      </div>
      <p style={{ fontSize: 10, color: '#444', marginTop: 3 }}>{zoneAdapts[idx]}</p>
    </div>
  );
}

function ActivityDetail({ act }) {
  const [open, setOpen] = useState(false);
  const strainC = act.strain >= 14 ? '#ef4444' : act.strain >= 10 ? '#f5a623' : '#60a5fa';
  const zoneArr = Object.values(act.zones);
  const totalMin = zoneArr.reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="card">
      <div onClick={() => setOpen(o => !o)} style={{ cursor: 'pointer' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 26 }}>{act.icon}</span>
            <div>
              <p style={{ fontWeight: 800, fontSize: 15 }}>{act.name}</p>
              <p style={{ fontSize: 11, color: '#555' }}>{act.time} · {act.duration} min</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 22, fontWeight: 900, color: strainC }}>{act.strain}</p>
            <p style={{ fontSize: 10, color: '#555' }}>strain · {open ? '▲' : '▼'}</p>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {[
            { label: 'Avg HR',   val: act.avgHr,      unit: 'bpm', color: '#ef4444' },
            { label: 'Max HR',   val: act.maxHr,      unit: 'bpm', color: '#ef4444' },
            { label: 'Calories', val: act.calories,   unit: 'cal', color: '#2ef88b' },
            { label: 'Max HR%',  val: `${act.maxHrPct}%`, unit: '',  color: '#f5a623' },
          ].map(m => (
            <div key={m.label} style={{ background: '#181818', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
              <p style={{ fontSize: 9, color: '#555', fontWeight: 700, marginBottom: 3 }}>{m.label.toUpperCase()}</p>
              <p style={{ fontSize: 13, fontWeight: 800, color: m.color }}>{m.val}<span style={{ fontSize: 8, color: '#555', marginLeft: 2 }}>{m.unit}</span></p>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 14, borderTop: '1px solid #1e1e1e', paddingTop: 14 }}>
          {act.distance && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <div style={{ flex: 1, background: '#181818', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                <p style={{ fontSize: 9, color: '#555', fontWeight: 700, marginBottom: 3 }}>DISTANCE</p>
                <p style={{ fontSize: 16, fontWeight: 800, color: '#60a5fa' }}>{act.distance} mi</p>
              </div>
              {act.pace && (
                <div style={{ flex: 1, background: '#181818', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                  <p style={{ fontSize: 9, color: '#555', fontWeight: 700, marginBottom: 3 }}>PACE</p>
                  <p style={{ fontSize: 16, fontWeight: 800, color: '#a78bfa' }}>{act.pace}/mi</p>
                </div>
              )}
            </div>
          )}

          {/* HR zone strip */}
          <p style={{ fontSize: 10, color: '#444', fontWeight: 700, letterSpacing: '0.5px', marginBottom: 8 }}>HEART RATE ZONES</p>
          <div style={{ display: 'flex', height: 20, borderRadius: 5, overflow: 'hidden', gap: 2, marginBottom: 12 }}>
            {zoneArr.map((min, i) => min > 0 && (
              <div key={i} style={{ flex: min, background: zoneColors[i], opacity: 0.85 }} title={`${zoneLabels[i]}: ${min}min`} />
            ))}
          </div>
          {zoneArr.map((min, i) => min > 0 && (
            <ZoneRow key={i} idx={i} minutes={min} pct={act.zonePcts[`z${i+1}`]} total={totalMin} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function StrainView() {
  const strainC = strain.score >= 14 ? '#ef4444' : strain.score >= 10 ? '#f5a623' : '#60a5fa';
  const chartData = strainHistory.map(d => ({ date: d.date.slice(5), strain: d.strain, recovery: d.recovery }));

  // Weekly training load (accumulated strain)
  const weeklyLoad = strainHistory.reduce((s, d) => s + d.strain, 0).toFixed(1);
  const maxHrPct = strain.maxHrPct;

  return (
    <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ padding: '20px 0 6px' }}>
        <p style={{ fontSize: 11, color: '#555', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Today</p>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>Strain & Activity</h1>
      </div>

      {/* Day strain hero */}
      <div className="card animate-fade-up" style={{ textAlign: 'center', padding: '24px 20px' }}>
        <div style={{ fontSize: 68, fontWeight: 900, color: strainC, letterSpacing: '-3px', lineHeight: 1 }}>{strain.score}</div>
        <p style={{ fontSize: 11, color: '#555', letterSpacing: '2px', marginTop: 4 }}>DAY STRAIN / 21</p>

        {/* Gradient scale */}
        <div style={{ position: 'relative', height: 10, background: 'linear-gradient(90deg,#60a5fa 0%,#2ef88b 33%,#f5a623 66%,#ef4444 100%)', borderRadius: 5, marginTop: 18, opacity: 0.7 }}>
          <div style={{
            position: 'absolute', top: -3, left: `${(strain.score / 21) * 100}%`,
            width: 16, height: 16, borderRadius: '50%',
            background: strainC, border: '2px solid #080808', transform: 'translateX(-50%)',
            boxShadow: `0 0 10px ${strainC}`,
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#444', marginTop: 4 }}>
          <span>0 Rest</span><span>7 Light</span><span>14 Mod</span><span>21 All-out</span>
        </div>

        {/* Strain coach target */}
        <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: `${strain.coach.color}10`, border: `1px solid ${strain.coach.color}25` }}>
          <p style={{ fontSize: 11, color: strain.coach.color, fontWeight: 700 }}>
            🎯 Target today: {strain.coach.low}–{strain.coach.high} · {strain.coach.label}
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16 }}>
          {[
            { label: 'TOTAL CAL', val: strain.calories.toLocaleString(), sub: `${strain.activeCalories} active` },
            { label: 'AVG HR',    val: `${strain.avgHr}`, sub: 'bpm' },
            { label: 'MAX HR',    val: `${strain.maxHr}`, sub: `${maxHrPct}% of max` },
            { label: 'VO₂ MAX',   val: strain.vo2max,     sub: 'ml/kg/min' },
          ].map(m => (
            <div key={m.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 9, color: '#555', fontWeight: 700, letterSpacing: '0.4px' }}>{m.label}</p>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#f0f0f0', marginTop: 3 }}>{m.val}</p>
              <p style={{ fontSize: 9, color: '#444' }}>{m.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activities */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="animate-fade-up">
        <p style={{ fontSize: 13, fontWeight: 700, color: '#888' }}>Tap an activity to expand zones</p>
        {strain.activities.map(act => <ActivityDetail key={act.id} act={act} />)}
      </div>

      {/* 7-day strain vs recovery */}
      <div className="card animate-fade-up">
        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>7-Day Strain vs Recovery</p>
        <p style={{ fontSize: 11, color: '#555', marginBottom: 14 }}>Weekly training load: <span style={{ color: '#f5a623', fontWeight: 700 }}>{weeklyLoad}</span></p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} barSize={22} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="s" domain={[0, 21]}  tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="r" orientation="right" domain={[0,100]} tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
            <Tooltip content={<TT />} cursor={{ fill: '#ffffff06' }} />
            <Bar yAxisId="s" dataKey="strain" radius={[6,6,0,0]} name="Strain">
              {chartData.map((d, i) => <Cell key={i} fill={d.strain >= 14 ? '#ef4444' : d.strain >= 10 ? '#f5a623' : '#60a5fa'} opacity={i === chartData.length - 1 ? 1 : 0.65} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 6 }}>
          {[['#60a5fa','Light (<10)'],['#f5a623','Moderate (10-14)'],['#ef4444','High (14+)']].map(([c,l]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: 'inline-block' }} />
              <span style={{ fontSize: 10, color: '#666' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* HR Zone legend */}
      <div className="card animate-fade-up">
        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>HR Zone Guide</p>
        <p style={{ fontSize: 11, color: '#555', marginBottom: 12 }}>Based on est. max HR {strain.estimatedMaxHr} bpm</p>
        {zoneLabels.map((z, i) => {
          const maxHR = strain.estimatedMaxHr;
          const pcts = [[50,60],[60,70],[70,80],[80,90],[90,100]];
          const [lo, hi] = pcts[i];
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: zoneColors[i], flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: zoneColors[i] }}>{z}</span>
                  <span style={{ fontSize: 11, color: '#555' }}>{Math.round(maxHR * lo / 100)}–{Math.round(maxHR * hi / 100)} bpm</span>
                </div>
                <p style={{ fontSize: 10, color: '#444' }}>{zoneAdapts[i]}</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
