import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { journalHistory, todayStats } from '../data/mockData';

const MOODS = [
  { emoji: '😫', label: 'Rough',  score: 1, color: '#ef4444' },
  { emoji: '😕', label: 'Low',    score: 2, color: '#f97316' },
  { emoji: '😐', label: 'Okay',   score: 3, color: '#f5a623' },
  { emoji: '🙂', label: 'Good',   score: 4, color: '#84cc16' },
  { emoji: '😤', label: 'Dialed', score: 5, color: '#2ef88b' },
];
const FEELINGS = ['💪 Strong','🧠 Sharp','😴 Tired','🤒 Sore','🔥 Motivated','😰 Stressed','🏆 Crushing it','🥱 Low energy','😎 Locked in','🫀 Heart racing'];

const weightHistory = [
  { date: '4/29', weight: 183.4 },{ date: '4/30', weight: 182.8 },
  { date: '5/01', weight: 183.1 },{ date: '5/02', weight: 182.2 },
  { date: '5/03', weight: 181.9 },{ date: '5/04', weight: 181.4 },
  { date: '5/05', weight: 181.0 },
];

const WTT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: 10, padding: '8px 12px' }}>
      <p style={{ fontSize: 11, color: '#888' }}>{label}</p>
      <p style={{ fontSize: 13, color: '#60a5fa', fontWeight: 700 }}>{payload[0]?.value} lbs</p>
    </div>
  );
};

// WHOOP-style behavior rows
function BehaviorRow({ icon, label, value, onChange, type = 'toggle', options }) {
  if (type === 'select' && options) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #181818' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span style={{ fontSize: 13, color: '#ddd', fontWeight: 500 }}>{label}</span>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {options.map((opt, i) => (
            <button key={i} onClick={() => onChange(i)} style={{
              padding: '5px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700,
              background: value === i ? opt.color + '30' : '#181818',
              color: value === i ? opt.color : '#555',
              border: `1px solid ${value === i ? opt.color + '50' : '#222'}`,
              transition: 'all 0.15s',
            }}>{opt.label}</button>
          ))}
        </div>
      </div>
    );
  }

  const isOn = !!value;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #181818' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontSize: 13, color: '#ddd', fontWeight: 500 }}>{label}</span>
      </div>
      <button onClick={() => onChange(!value)} style={{
        width: 46, height: 26, borderRadius: 13, border: 'none',
        background: isOn ? '#2ef88b' : '#2a2a2a', position: 'relative', transition: 'background 0.2s',
      }}>
        <div style={{
          position: 'absolute', top: 3, left: isOn ? 23 : 3,
          width: 20, height: 20, borderRadius: '50%', background: '#fff',
          transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
        }} />
      </button>
    </div>
  );
}

const STRESS_OPTS = [
  { label: 'Low',     color: '#2ef88b' },
  { label: 'Mod',     color: '#f5a623' },
  { label: 'High',    color: '#f97316' },
  { label: 'V. High', color: '#ef4444' },
];
const ALCOHOL_OPTS = [
  { label: 'None', color: '#2ef88b' },
  { label: '1–2',  color: '#f5a623' },
  { label: '3–4',  color: '#f97316' },
  { label: '5+',   color: '#ef4444' },
];

export default function JournalView() {
  const [tab, setTab] = useState('checkin');
  const [mood, setMood]         = useState(null);
  const [feelings, setFeelings] = useState([]);
  const [energy, setEnergy]     = useState(7);
  const [note, setNote]         = useState('');
  const [weight, setWeight]     = useState('');
  const [savedWeight, setSavedWeight] = useState(181.0);
  const [submitted, setSubmitted] = useState(false);

  const [b, setB] = useState({ ...todayStats.behaviors });
  const setField = (key) => (val) => setB(prev => ({ ...prev, [key]: val }));

  const currentMood = MOODS.find(m => m.score === mood);
  const weightChange = savedWeight - weightHistory[0].weight;
  const weightColor  = weightChange < 0 ? '#2ef88b' : weightChange > 0 ? '#ef4444' : '#888';

  function toggleFeeling(f) {
    setFeelings(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  }
  function saveCheckin() {
    if (!mood) return;
    if (weight) setSavedWeight(parseFloat(weight));
    setSubmitted(true);
  }

  return (
    <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ padding: '20px 0 6px' }}>
        <p style={{ fontSize: 11, color: '#555', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Daily Check-in</p>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>Journal</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 4 }}>
        {[['checkin','How I Feel'],['behaviors','Behaviors'],['weight','Weight']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            flex: 1, padding: '9px 0', borderRadius: 9, fontSize: 11, fontWeight: 700,
            background: tab === k ? '#2ef88b' : 'transparent',
            color: tab === k ? '#000' : '#666', transition: 'all 0.2s',
          }}>{l}</button>
        ))}
      </div>

      {/* ── Check-in ──────────────────────────────────────────────────────── */}
      {tab === 'checkin' && (
        <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {submitted ? (
            <div className="card" style={{ textAlign: 'center', padding: '32px 24px', borderColor: '#2ef88b30', background: '#2ef88b08' }}>
              <span style={{ fontSize: 48 }}>{currentMood?.emoji}</span>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#2ef88b', marginTop: 12 }}>Check-in Saved!</p>
              <p style={{ fontSize: 13, color: '#888', marginTop: 6, lineHeight: 1.5 }}>
                Mood: {currentMood?.label} · Energy: {energy}/10<br/>
                {feelings.length > 0 ? feelings.join(' ') : ''}
              </p>
              <button onClick={() => setSubmitted(false)} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 10, fontSize: 13, fontWeight: 700, background: '#2ef88b20', color: '#2ef88b', border: '1px solid #2ef88b30' }}>
                Edit Entry
              </button>
            </div>
          ) : (
            <>
              {/* Mood */}
              <div className="card">
                <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Overall Mood</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                  {MOODS.map(m => (
                    <button key={m.score} onClick={() => setMood(m.score)} style={{
                      flex: 1, padding: '12px 4px', borderRadius: 12,
                      background: mood === m.score ? `${m.color}20` : '#181818',
                      border: `2px solid ${mood === m.score ? m.color : '#1e1e1e'}`,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, transition: 'all 0.15s',
                    }}>
                      <span style={{ fontSize: 24 }}>{m.emoji}</span>
                      <span style={{ fontSize: 8, fontWeight: 700, color: mood === m.score ? m.color : '#555', letterSpacing: '0.3px' }}>{m.label.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <p style={{ fontWeight: 700, fontSize: 15 }}>Energy Level</p>
                  <span style={{ fontSize: 20, fontWeight: 900, color: energy >= 7 ? '#2ef88b' : energy >= 4 ? '#f5a623' : '#ef4444' }}>{energy}/10</span>
                </div>
                <input type="range" min={1} max={10} value={energy} onChange={e => setEnergy(+e.target.value)}
                  style={{ width: '100%', accentColor: '#2ef88b', height: 6 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                  <span style={{ fontSize: 10, color: '#555' }}>💀 Wrecked</span>
                  <span style={{ fontSize: 10, color: '#555' }}>🔥 Beast mode</span>
                </div>
              </div>

              {/* Feel tags */}
              <div className="card">
                <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>How do you feel? <span style={{ fontSize: 11, color: '#555', fontWeight: 400 }}>pick all</span></p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {FEELINGS.map(f => (
                    <button key={f} onClick={() => toggleFeeling(f)} style={{
                      padding: '7px 11px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                      background: feelings.includes(f) ? '#2ef88b20' : '#181818',
                      color: feelings.includes(f) ? '#2ef88b' : '#888',
                      border: `1px solid ${feelings.includes(f) ? '#2ef88b40' : '#222'}`, transition: 'all 0.15s',
                    }}>{f}</button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="card">
                <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Notes</p>
                <textarea value={note} onChange={e => setNote(e.target.value)}
                  placeholder="Training progress, how recovery is going, anything notable..."
                  rows={4} style={{
                    width: '100%', background: '#181818', border: '1px solid #222', borderRadius: 12,
                    padding: '12px 14px', fontSize: 13, color: '#f0f0f0', outline: 'none',
                    fontFamily: 'inherit', resize: 'none', lineHeight: 1.6,
                  }} />
              </div>

              {/* Day snapshot */}
              <div className="card" style={{ borderColor: '#2ef88b20', background: '#2ef88b06' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#2ef88b', marginBottom: 10 }}>📊 Today's Snapshot</p>
                {[
                  { label: 'Recovery',    val: `${todayStats.recovery.score}%`,  color: '#2ef88b' },
                  { label: 'HRV',         val: `${todayStats.recovery.hrv} ms`,  color: '#2ef88b' },
                  { label: 'RHR',         val: `${todayStats.recovery.rhr} bpm`, color: '#60a5fa' },
                  { label: 'Sleep Score', val: `${todayStats.sleep.score}%`,     color: '#a78bfa' },
                  { label: 'Strain',      val: todayStats.strain.score,           color: '#f5a623' },
                  { label: 'Weight',      val: `${savedWeight} lbs`,              color: '#60a5fa' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #1a1a1a' }}>
                    <span style={{ fontSize: 12, color: '#666' }}>{item.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.val}</span>
                  </div>
                ))}
              </div>

              <button onClick={saveCheckin} disabled={!mood} style={{
                padding: '16px', borderRadius: 14, fontSize: 15, fontWeight: 800,
                background: mood ? 'linear-gradient(135deg, #2ef88b, #60a5fa)' : '#1e1e1e',
                color: mood ? '#000' : '#444', border: 'none', letterSpacing: '0.5px',
                boxShadow: mood ? '0 8px 24px rgba(46,248,139,0.2)' : 'none', transition: 'all 0.2s',
              }}>Save Check-in</button>
            </>
          )}
        </div>
      )}

      {/* ── Behaviors (WHOOP journal) ─────────────────────────────────────── */}
      {tab === 'behaviors' && (
        <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card">
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Today's Behaviors</p>
            <p style={{ fontSize: 11, color: '#555', marginBottom: 16 }}>These factors affect tomorrow's recovery score</p>

            <BehaviorRow icon="🍺" label="Alcohol consumed"      type="select" options={ALCOHOL_OPTS}  value={b.alcohol}             onChange={setField('alcohol')} />
            <BehaviorRow icon="😰" label="Stress level"         type="select" options={STRESS_OPTS}   value={b.stressLevel - 1}     onChange={v => setField('stressLevel')(v + 1)} />
            <BehaviorRow icon="☕" label="Caffeine after noon"   value={b.caffeineAfterNoon}  onChange={setField('caffeineAfterNoon')} />
            <BehaviorRow icon="🌙" label="Ate within 2h of bed" value={b.lateMeal}           onChange={setField('lateMeal')} />
            <BehaviorRow icon="📱" label="Screen before bed"    value={b.screenBeforeBed}    onChange={setField('screenBeforeBed')} />
            <BehaviorRow icon="🧘" label="Meditation / breathwork" value={b.meditation}      onChange={setField('meditation')} />
            <BehaviorRow icon="💊" label="Sleep aid taken"      value={b.sleepAid}           onChange={setField('sleepAid')} />
            <BehaviorRow icon="🚬" label="Nicotine / tobacco"   value={b.nicotine}           onChange={setField('nicotine')} />
            <BehaviorRow icon="🤒" label="Feeling sick / unwell" value={b.sick}              onChange={setField('sick')} />
            <BehaviorRow icon="⚡" label="Pre-workout taken"    value={b.preworkout}         onChange={setField('preworkout')} />
            <BehaviorRow icon="🧊" label="Cold plunge today"    value={b.cold}               onChange={setField('cold')} />
            <BehaviorRow icon="🔥" label="Sauna today"         value={b.sauna}               onChange={setField('sauna')} />
          </div>

          {/* Impact estimate */}
          <div className="card" style={{ borderColor: '#2ef88b20', background: '#2ef88b06' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#2ef88b', marginBottom: 10 }}>📈 Estimated Recovery Impact</p>
            {[
              { cond: b.alcohol === 0,           label: 'No alcohol',              impact: +5  },
              { cond: b.alcohol === 1,           label: '1–2 drinks',             impact: -14 },
              { cond: b.alcohol >= 2,            label: '3+ drinks',              impact: -27 },
              { cond: !b.caffeineAfterNoon,     label: 'No late caffeine',        impact: +3  },
              { cond: b.caffeineAfterNoon,      label: 'Caffeine after noon',     impact: -11 },
              { cond: !b.lateMeal,              label: 'No late meal',            impact: +2  },
              { cond: b.lateMeal,               label: 'Late meal',               impact: -9  },
              { cond: b.meditation,             label: 'Meditation',              impact: +6  },
              { cond: b.cold,                   label: 'Cold plunge',             impact: +5  },
              { cond: b.sauna,                  label: 'Sauna',                   impact: +8  },
              { cond: !b.screenBeforeBed,       label: 'No screen before bed',   impact: +3  },
              { cond: b.screenBeforeBed,        label: 'Screen before bed',       impact: -5  },
              { cond: b.stressLevel <= 1,       label: 'Low stress',              impact: +4  },
              { cond: b.stressLevel >= 3,       label: 'High stress',             impact: -17 },
            ].filter(r => r.cond).map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #1a1a1a' }}>
                <span style={{ fontSize: 12, color: '#888' }}>{r.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: r.impact > 0 ? '#2ef88b' : '#ef4444' }}>
                  {r.impact > 0 ? '+' : ''}{r.impact}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Weight ────────────────────────────────────────────────────────── */}
      {tab === 'weight' && (
        <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card" style={{ padding: '24px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 10, color: '#555', fontWeight: 700, letterSpacing: '0.8px' }}>CURRENT WEIGHT</p>
            <p style={{ fontSize: 56, fontWeight: 900, color: '#60a5fa', letterSpacing: '-2px', lineHeight: 1, marginTop: 8 }}>{savedWeight}</p>
            <p style={{ fontSize: 14, color: '#555', marginTop: 4 }}>lbs</p>
            <p style={{ fontSize: 13, color: weightColor, fontWeight: 700, marginTop: 10 }}>
              {weightChange < 0 ? `↓ ${Math.abs(weightChange).toFixed(1)} lbs` : weightChange > 0 ? `↑ ${weightChange.toFixed(1)} lbs` : '— Stable'} from 7 days ago
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <input value={weight} onChange={e => setWeight(e.target.value)} type="number" step="0.1" placeholder="Enter weight..."
                style={{ flex: 1, background: '#181818', border: '1px solid #2a2a2a', borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#f0f0f0', outline: 'none', fontFamily: 'inherit' }} />
              <button onClick={() => { if (weight) { setSavedWeight(parseFloat(weight)); setWeight(''); } }} style={{ padding: '11px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, background: '#60a5fa20', color: '#60a5fa', border: '1px solid #60a5fa30' }}>Log</button>
            </div>
          </div>

          <div className="card">
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>7-Day Weight Trend</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={weightHistory} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                <Tooltip content={<WTT />} cursor={{ stroke: '#ffffff15' }} />
                <ReferenceLine y={weightHistory[0].weight} stroke="#333" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="weight" stroke="#60a5fa" strokeWidth={2.5} dot={{ fill: '#60a5fa', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Goal cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: '7-Day Loss', val: `−${Math.abs(weightChange).toFixed(1)} lbs`, color: weightChange < 0 ? '#2ef88b' : '#ef4444' },
              { label: 'Goal Weight', val: '175 lbs',   color: '#f5a623' },
              { label: 'To Goal',     val: `${(savedWeight - 175).toFixed(1)} lbs`, color: '#60a5fa' },
              { label: 'Pace',        val: `−${((Math.abs(weightChange) / 7) * 7).toFixed(1)}/wk`, color: '#a78bfa' },
            ].map(m => (
              <div key={m.label} className="card" style={{ padding: '14px 16px' }}>
                <p style={{ fontSize: 10, color: '#555', fontWeight: 700, letterSpacing: '0.4px', marginBottom: 5 }}>{m.label.toUpperCase()}</p>
                <p style={{ fontSize: 20, fontWeight: 900, color: m.color }}>{m.val}</p>
              </div>
            ))}
          </div>

          <div className="card" style={{ borderColor: '#60a5fa25', background: '#60a5fa08' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#60a5fa', marginBottom: 8 }}>💡 WHOOP + Body Composition</p>
            <p style={{ fontSize: 11, color: '#888', lineHeight: 1.6 }}>
              Higher recovery scores correlate with better body composition outcomes. Prioritizing sleep and managing strain keeps cortisol low, supporting fat loss while preserving muscle.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
