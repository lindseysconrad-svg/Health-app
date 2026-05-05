import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { therapyHistory, therapyDefaults } from '../data/mockData';

// ─── helpers ────────────────────────────────────────────────────────────────
const FEEL = ['😫','😕','😐','🙂','😤'];

function weeklyMinutes(key) {
  return therapyHistory.reduce((sum, day) => {
    return sum + day[key].reduce((s, s2) => s + s2.durationMin, 0);
  }, 0);
}

function totalSessions(key) {
  return therapyHistory.reduce((sum, day) => sum + day[key].length, 0);
}

const coldColor  = '#60a5fa';
const saunaColor = '#f97316';

const CustomTT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: 10, padding: '8px 12px' }}>
      <p style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ fontSize: 12, color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value} min
        </p>
      ))}
    </div>
  );
};

// ─── sub-components ──────────────────────────────────────────────────────────
function SessionBadge({ session, type }) {
  const color = type === 'cold' ? coldColor : saunaColor;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '11px 14px', borderRadius: 12,
      background: `${color}10`, border: `1px solid ${color}25`,
    }}>
      <div>
        <p style={{ fontWeight: 700, fontSize: 13, color }}>
          {type === 'cold' ? '🧊' : '🔥'} {session.tempF}°F · {session.durationMin} min
          {session.rounds ? ` · ${session.rounds} rounds` : ''}
        </p>
        <p style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{session.time}</p>
      </div>
      <span style={{ fontSize: 20 }}>{FEEL[session.feeling - 1]}</span>
    </div>
  );
}

function LogModal({ type, onSave, onClose }) {
  const defaults = type === 'cold' ? therapyDefaults.coldPlunge : therapyDefaults.sauna;
  const color    = type === 'cold' ? coldColor : saunaColor;
  const [temp, setTemp]       = useState(defaults.tempF);
  const [dur,  setDur]        = useState(defaults.durationMin);
  const [rounds, setRounds]   = useState(2);
  const [feeling, setFeeling] = useState(4);
  const [time, setTime]       = useState(
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', zIndex: 200,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 430,
        background: '#111', borderTop: '1px solid #2a2a2a',
        borderRadius: '20px 20px 0 0', padding: '24px 20px 36px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <p style={{ fontWeight: 800, fontSize: 17, color }}>
            {type === 'cold' ? '🧊 Log Cold Plunge' : '🔥 Log Sauna'}
          </p>
          <button onClick={onClose} style={{ background: 'none', color: '#555', fontSize: 20 }}>✕</button>
        </div>

        {/* Temperature */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <p style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>Temperature</p>
            <p style={{ fontSize: 15, fontWeight: 800, color }}>{temp}°F</p>
          </div>
          <input type="range"
            min={type === 'cold' ? 34 : 140}
            max={type === 'cold' ? 65  : 220}
            value={temp} onChange={e => setTemp(+e.target.value)}
            style={{ width: '100%', accentColor: color, height: 6 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 10, color: '#444' }}>{type === 'cold' ? '34°F (extreme)' : '140°F'}</span>
            <span style={{ fontSize: 10, color: '#444' }}>{type === 'cold' ? '65°F' : '220°F'}</span>
          </div>
        </div>

        {/* Duration */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <p style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>Duration</p>
            <p style={{ fontSize: 15, fontWeight: 800, color }}>{dur} min</p>
          </div>
          <input type="range" min={1} max={type === 'cold' ? 20 : 60}
            value={dur} onChange={e => setDur(+e.target.value)}
            style={{ width: '100%', accentColor: color, height: 6 }}
          />
        </div>

        {/* Rounds (sauna only) */}
        {type === 'sauna' && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>Rounds</p>
              <p style={{ fontSize: 15, fontWeight: 800, color }}>{rounds}</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setRounds(n)} style={{
                  flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 700,
                  background: rounds === n ? `${color}25` : '#181818',
                  color: rounds === n ? color : '#555',
                  border: `1px solid ${rounds === n ? color + '50' : '#222'}`,
                }}>{n}</button>
              ))}
            </div>
          </div>
        )}

        {/* Time */}
        <div style={{ marginBottom: 18 }}>
          <p style={{ fontSize: 13, color: '#888', fontWeight: 600, marginBottom: 8 }}>Time</p>
          <input value={time} onChange={e => setTime(e.target.value)}
            style={{
              width: '100%', background: '#181818', border: '1px solid #2a2a2a',
              borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#f0f0f0',
              outline: 'none', fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Feeling */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: '#888', fontWeight: 600, marginBottom: 10 }}>How did it feel?</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {FEEL.map((emoji, i) => (
              <button key={i} onClick={() => setFeeling(i + 1)} style={{
                flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 20,
                background: feeling === i + 1 ? `${color}20` : '#181818',
                border: `2px solid ${feeling === i + 1 ? color : '#1e1e1e'}`,
              }}>{emoji}</button>
            ))}
          </div>
        </div>

        <button onClick={() => onSave({ tempF: temp, durationMin: dur, rounds, feeling, time })} style={{
          width: '100%', padding: '16px', borderRadius: 14, fontSize: 15, fontWeight: 800,
          background: `linear-gradient(135deg, ${color}, ${type === 'cold' ? '#a78bfa' : '#ef4444'})`,
          color: '#fff', border: 'none',
          boxShadow: `0 8px 24px ${color}40`,
        }}>
          Save Session
        </button>
      </div>
    </div>
  );
}

// ─── main view ───────────────────────────────────────────────────────────────
export default function TherapyView() {
  const [todayCold,  setTodayCold]  = useState(therapyHistory.at(-1).coldPlunge);
  const [todaySauna, setTodaySauna] = useState(therapyHistory.at(-1).sauna);
  const [modal, setModal] = useState(null); // 'cold' | 'sauna' | null

  const coldWeekMin  = weeklyMinutes('coldPlunge');
  const saunaWeekMin = weeklyMinutes('sauna');
  const coldSessions = totalSessions('coldPlunge');
  const saunaSessions= totalSessions('sauna');

  // chart data
  const chartData = therapyHistory.map(day => ({
    date: day.date.slice(5),
    cold:  day.coldPlunge.reduce((s, x) => s + x.durationMin, 0),
    sauna: day.sauna.reduce((s, x) => s + x.durationMin, 0),
  }));

  function saveSession(type, session) {
    if (type === 'cold') setTodayCold(prev => [...prev, session]);
    else                  setTodaySauna(prev => [...prev, session]);
    setModal(null);
  }

  // Huberman protocol target: 11 min cold/week, 57+ min sauna/week
  const coldPct  = Math.min((coldWeekMin  / 11) * 100, 100);
  const saunaPct = Math.min((saunaWeekMin / 57) * 100, 100);

  return (
    <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Modal */}
      {modal && (
        <LogModal type={modal} onSave={(s) => saveSession(modal, s)} onClose={() => setModal(null)} />
      )}

      {/* Header */}
      <div style={{ padding: '20px 0 8px' }}>
        <p style={{ fontSize: 12, color: '#555', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Recovery Tools</p>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>Thermal Therapy</h1>
      </div>

      {/* Quick-log buttons */}
      <div style={{ display: 'flex', gap: 12 }} className="animate-fade-up">
        <button onClick={() => setModal('cold')} style={{
          flex: 1, padding: '18px 12px', borderRadius: 16,
          background: `linear-gradient(135deg, #1e3a5f, #0d1b2e)`,
          border: `1px solid ${coldColor}40`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          transition: 'transform 0.15s, box-shadow 0.15s',
          boxShadow: `0 4px 20px ${coldColor}20`,
        }}>
          <span style={{ fontSize: 32 }}>🧊</span>
          <p style={{ fontSize: 14, fontWeight: 800, color: coldColor }}>Cold Plunge</p>
          <p style={{ fontSize: 11, color: '#4a7fa0' }}>
            {todayCold.length > 0 ? `${todayCold.length} session${todayCold.length > 1 ? 's' : ''} today` : 'Tap to log'}
          </p>
        </button>

        <button onClick={() => setModal('sauna')} style={{
          flex: 1, padding: '18px 12px', borderRadius: 16,
          background: `linear-gradient(135deg, #3d1c0a, #1e0e04)`,
          border: `1px solid ${saunaColor}40`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          transition: 'transform 0.15s, box-shadow 0.15s',
          boxShadow: `0 4px 20px ${saunaColor}20`,
        }}>
          <span style={{ fontSize: 32 }}>🔥</span>
          <p style={{ fontSize: 14, fontWeight: 800, color: saunaColor }}>Sauna</p>
          <p style={{ fontSize: 11, color: '#9d6040' }}>
            {todaySauna.length > 0 ? `${todaySauna.length} session${todaySauna.length > 1 ? 's' : ''} today` : 'Tap to log'}
          </p>
        </button>
      </div>

      {/* Today's sessions */}
      {(todayCold.length > 0 || todaySauna.length > 0) && (
        <div className="card animate-fade-up">
          <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Today's Sessions</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {todayCold.map((s, i)  => <SessionBadge key={`c${i}`} session={s} type="cold" />)}
            {todaySauna.map((s, i) => <SessionBadge key={`s${i}`} session={s} type="sauna" />)}
          </div>
        </div>
      )}

      {/* Weekly protocol progress */}
      <div className="card animate-fade-up">
        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Weekly Protocol</p>

        {/* Cold */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🧊</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Cold Plunge</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: coldColor }}>{coldWeekMin} min</span>
              <span style={{ fontSize: 11, color: '#555' }}> / 11 min goal</span>
            </div>
          </div>
          <div style={{ background: '#1e1e1e', borderRadius: 8, height: 10, overflow: 'hidden' }}>
            <div style={{
              width: `${coldPct}%`, height: '100%', borderRadius: 8,
              background: `linear-gradient(90deg, #60a5fa, #a78bfa)`,
              boxShadow: `0 0 10px ${coldColor}55`,
              transition: 'width 1s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
            <span style={{ fontSize: 10, color: '#444' }}>{coldSessions} sessions this week</span>
            <span style={{ fontSize: 10, color: coldPct >= 100 ? '#2ef88b' : '#555' }}>
              {coldPct >= 100 ? '✓ Goal hit' : `${(11 - coldWeekMin).toFixed(0)} min left`}
            </span>
          </div>
        </div>

        {/* Sauna */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🔥</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Sauna</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: saunaColor }}>{saunaWeekMin} min</span>
              <span style={{ fontSize: 11, color: '#555' }}> / 57 min goal</span>
            </div>
          </div>
          <div style={{ background: '#1e1e1e', borderRadius: 8, height: 10, overflow: 'hidden' }}>
            <div style={{
              width: `${saunaPct}%`, height: '100%', borderRadius: 8,
              background: `linear-gradient(90deg, #f97316, #ef4444)`,
              boxShadow: `0 0 10px ${saunaColor}55`,
              transition: 'width 1s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
            <span style={{ fontSize: 10, color: '#444' }}>{saunaSessions} sessions this week</span>
            <span style={{ fontSize: 10, color: saunaPct >= 100 ? '#2ef88b' : '#555' }}>
              {saunaPct >= 100 ? '✓ Goal hit' : `${(57 - saunaWeekMin)} min left`}
            </span>
          </div>
        </div>
      </div>

      {/* 7-day chart */}
      <div className="card animate-fade-up">
        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>7-Day History</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} barSize={14} barGap={3} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTT />} cursor={{ fill: '#ffffff06' }} />
            <Bar dataKey="cold"  fill={coldColor}  radius={[4,4,0,0]} name="Cold Plunge" opacity={0.85} />
            <Bar dataKey="sauna" fill={saunaColor} radius={[4,4,0,0]} name="Sauna"       opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
          <span style={{ fontSize: 11, color: coldColor }}>● Cold Plunge</span>
          <span style={{ fontSize: 11, color: saunaColor }}>● Sauna</span>
        </div>
      </div>

      {/* Contrast therapy card */}
      <div className="card animate-fade-up" style={{ borderColor: '#ffffff15', background: 'linear-gradient(135deg, #0d1b2e, #1e0e04)', padding: '20px' }}>
        <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 8 }}>
          <span style={{ color: coldColor }}>🧊</span>
          <span style={{ color: '#888', margin: '0 8px' }}>→</span>
          <span style={{ color: saunaColor }}>🔥</span>
          {'  '}Contrast Therapy
        </p>
        <p style={{ fontSize: 12, color: '#777', lineHeight: 1.6, marginBottom: 14 }}>
          Maximize circulation and recovery: 20 min sauna → 2–3 min cold plunge → repeat 2–3 rounds. End cold for alertness, end hot for relaxation.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setModal('sauna')} style={{
            flex: 1, padding: '10px', borderRadius: 10, fontSize: 12, fontWeight: 700,
            background: `${saunaColor}20`, color: saunaColor, border: `1px solid ${saunaColor}35`,
          }}>Start Sauna</button>
          <button onClick={() => setModal('cold')} style={{
            flex: 1, padding: '10px', borderRadius: 10, fontSize: 12, fontWeight: 700,
            background: `${coldColor}20`, color: coldColor, border: `1px solid ${coldColor}35`,
          }}>Start Cold</button>
        </div>
      </div>

      {/* Benefits cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} className="animate-fade-up">
        {/* Cold benefits */}
        <div className="card" style={{ borderColor: `${coldColor}25`, background: `${coldColor}06` }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: coldColor, marginBottom: 10 }}>🧊 Cold Plunge Benefits</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[
              '↑ Dopamine +250%','↑ Norepinephrine','↓ Inflammation',
              '↑ Mental toughness','↑ HRV over time','↑ Alertness & focus',
              '↓ Muscle soreness','↑ Fat oxidation',
            ].map(b => (
              <span key={b} style={{
                fontSize: 11, padding: '4px 10px', borderRadius: 8,
                background: `${coldColor}15`, color: coldColor, fontWeight: 600,
              }}>{b}</span>
            ))}
          </div>
          <p style={{ fontSize: 11, color: '#444', marginTop: 10 }}>
            Huberman protocol: 11 min/week · best in morning · 50–60°F ideal range
          </p>
        </div>

        {/* Sauna benefits */}
        <div className="card" style={{ borderColor: `${saunaColor}25`, background: `${saunaColor}06` }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: saunaColor, marginBottom: 10 }}>🔥 Sauna Benefits</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[
              '↑ Growth hormone','↑ Cardiovascular','↑ Deep sleep',
              '↓ All-cause mortality','↑ Heat shock proteins','↑ BDNF (brain)',
              '↓ Cortisol','↑ Endorphins',
            ].map(b => (
              <span key={b} style={{
                fontSize: 11, padding: '4px 10px', borderRadius: 8,
                background: `${saunaColor}15`, color: saunaColor, fontWeight: 600,
              }}>{b}</span>
            ))}
          </div>
          <p style={{ fontSize: 11, color: '#444', marginTop: 10 }}>
            Research protocol: 4–7×/week · 20 min sessions · 175–195°F · separate from workouts by 6h for hypertrophy
          </p>
        </div>
      </div>
    </div>
  );
}
