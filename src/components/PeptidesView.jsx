import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  peptideProfiles, peptideCalendar, supplementProfiles,
  testosteroneProfile, caffeineProfile, electrolyteProfile,
  todayStats,
} from '../data/mockData';

const { recovery, sleep } = todayStats;

// ─── helpers ────────────────────────────────────────────────────────────────
const FEEL = ['😫','😕','😐','🙂','😤'];
const feelColor = (r) => r >= 5 ? '#2ef88b' : r >= 4 ? '#84cc16' : r >= 3 ? '#f5a623' : '#ef4444';

function Tag({ children, color = '#2ef88b' }) {
  return (
    <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 7, background: `${color}18`, color, fontWeight: 700, border: `1px solid ${color}30` }}>
      {children}
    </span>
  );
}

function MetricCompare({ label, on, off, unit, lowerBetter = false }) {
  const diff = on - off;
  const good = lowerBetter ? diff < 0 : diff > 0;
  const color = good ? '#2ef88b' : '#ef4444';
  return (
    <div style={{ flex: 1, background: '#181818', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
      <p style={{ fontSize: 9, color: '#555', fontWeight: 700, letterSpacing: '0.4px', marginBottom: 4 }}>{label.toUpperCase()}</p>
      <p style={{ fontSize: 15, fontWeight: 900, color: '#f0f0f0' }}>{on}<span style={{ fontSize: 9, color: '#555', marginLeft: 2 }}>{unit}</span></p>
      <p style={{ fontSize: 10, color, fontWeight: 700, marginTop: 3 }}>
        {diff > 0 ? '+' : ''}{diff}{unit} vs no dose
      </p>
    </div>
  );
}

// ─── Feel sparkline ──────────────────────────────────────────────────────────
function FeelSpark({ history }) {
  const data = history
    .map((v, i) => ({ i, v }))
    .filter(d => d.v !== null);
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#2ef88b" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#2ef88b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke="#2ef88b" strokeWidth={1.5} fill="url(#fg)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Peptide detail card (expanded) ─────────────────────────────────────────
function PeptideDetail({ p, onClose }) {
  const [innerTab, setInnerTab] = useState('overview');
  const cycleActive = p.protocol.status === 'active';
  const cyclePct = p.protocol.cycleDays
    ? Math.round((p.protocol.cycleDay / p.protocol.cycleDays) * 100)
    : null;
  const avgFeel = p.feelHistory.filter(Boolean).reduce((a, b) => a + b, 0) /
                  p.feelHistory.filter(Boolean).length;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 200,
      overflowY: 'auto',
    }}>
      <div style={{ background: '#0d0d0d', minHeight: '100%', maxWidth: 430, margin: '0 auto', padding: '0 0 100px' }}>
        {/* Header */}
        <div style={{ padding: '20px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 28 }}>{p.icon}</span>
            <div>
              <p style={{ fontWeight: 900, fontSize: 20, color: p.color }}>{p.name}</p>
              <p style={{ fontSize: 11, color: '#555' }}>{p.category}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: '#222', border: '1px solid #333', borderRadius: 10, padding: '8px 14px', color: '#888', fontSize: 13, fontWeight: 700 }}>✕ Close</button>
        </div>

        {/* Inner tabs */}
        <div style={{ display: 'flex', gap: 5, margin: '16px 16px 0', background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 4 }}>
          {[['overview','Overview'],['notes','Notes'],['research','Research']].map(([k,l]) => (
            <button key={k} onClick={() => setInnerTab(k)} style={{
              flex: 1, padding: '8px 0', borderRadius: 9, fontSize: 11, fontWeight: 700,
              background: innerTab === k ? p.color : 'transparent',
              color: innerTab === k ? '#000' : '#666', transition: 'all 0.2s',
            }}>{l}</button>
          ))}
        </div>

        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {innerTab === 'overview' && (
            <>
              {/* Protocol */}
              <div className="card">
                <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Protocol</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { l: 'Dose',      v: p.protocol.dose },
                    { l: 'Frequency', v: p.protocol.frequency },
                    { l: 'Route',     v: p.protocol.route },
                    { l: 'Timing',    v: p.protocol.timing },
                    { l: 'Site',      v: p.protocol.injectionSite },
                    { l: 'Status',    v: cycleActive ? 'Active' : p.protocol.status === 'as-needed' ? 'As needed' : 'On break' },
                  ].map(m => (
                    <div key={m.l} style={{ background: '#181818', borderRadius: 9, padding: '9px 12px' }}>
                      <p style={{ fontSize: 9, color: '#555', fontWeight: 700, letterSpacing: '0.4px', marginBottom: 3 }}>{m.l.toUpperCase()}</p>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#f0f0f0' }}>{m.v}</p>
                    </div>
                  ))}
                </div>

                {/* Cycle progress */}
                {cyclePct !== null && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#888' }}>Cycle progress</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: p.color }}>Day {p.protocol.cycleDay} / {p.protocol.cycleDays}</span>
                    </div>
                    <div style={{ height: 8, background: '#1e1e1e', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${cyclePct}%`, height: '100%', background: p.color, borderRadius: 4, boxShadow: `0 0 8px ${p.color}55`, transition: 'width 1s ease' }} />
                    </div>
                    <p style={{ fontSize: 10, color: '#444', marginTop: 4 }}>
                      {p.protocol.cycleDays - p.protocol.cycleDay} days left · {p.protocol.breakWeeks}w break to follow
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                  {p.goals.map(g => <Tag key={g} color={p.color}>{g}</Tag>)}
                </div>
              </div>

              {/* WHOOP correlation */}
              {p.metricsOn && (
                <div className="card">
                  <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Your WHOOP Data — On vs Off Days</p>
                  <p style={{ fontSize: 11, color: '#555', marginBottom: 12 }}>How your metrics compare on days you take {p.name}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <MetricCompare label="HRV"      on={p.metricsOn.hrv}       off={p.metricsOff.hrv}       unit="ms"  />
                    <MetricCompare label="Recovery" on={p.metricsOn.recovery}  off={p.metricsOff.recovery}  unit="%"   />
                    <MetricCompare label="Sleep"    on={p.metricsOn.sleepScore}off={p.metricsOff.sleepScore}unit="%"   />
                    <MetricCompare label="RHR"      on={p.metricsOn.rhr}       off={p.metricsOff.rhr}       unit="bpm" lowerBetter />
                  </div>
                </div>
              )}

              {/* Feel history */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>30-Day Feel Rating</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 18 }}>{FEEL[Math.round(avgFeel) - 1]}</span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: feelColor(avgFeel) }}>{avgFeel.toFixed(1)}/5</span>
                  </div>
                </div>
                <FeelSpark history={p.feelHistory} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 9, color: '#444' }}>30d ago</span>
                  <span style={{ fontSize: 9, color: '#444' }}>Today</span>
                </div>

                {/* Self-rating */}
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: `${p.color}10`, borderRadius: 10, border: `1px solid ${p.color}25` }}>
                  <p style={{ fontSize: 13, color: '#888' }}>Overall effectiveness</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {Array.from({ length: 10 }, (_, i) => (
                        <div key={i} style={{ width: 14, height: 14, borderRadius: 3, background: i < p.effectivenessRating ? p.color : '#222' }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 900, color: p.color }}>{p.effectivenessRating}/10</span>
                  </div>
                </div>
              </div>

              {/* Side effects */}
              {p.sideEffects.length > 0 && (
                <div className="card">
                  <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Side Effects Observed</p>
                  {p.sideEffects.map((se, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '9px 0', borderBottom: i < p.sideEffects.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: se.resolved ? '#888' : '#f5a623' }}>{se.effect}</p>
                        <p style={{ fontSize: 10, color: '#444', marginTop: 2 }}>{se.date} · {se.duration}</p>
                      </div>
                      <Tag color={se.resolved ? '#2ef88b' : '#f5a623'}>{se.resolved ? 'Resolved' : 'Ongoing'}</Tag>
                    </div>
                  ))}
                </div>
              )}

              {/* Stacks with */}
              <div className="card">
                <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Stack Synergies</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                  {p.research.stacksWith.map(s => <Tag key={s} color="#2ef88b">✓ {s}</Tag>)}
                </div>
                {p.research.avoidWith.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {p.research.avoidWith.map(s => <Tag key={s} color="#ef4444">✗ {s}</Tag>)}
                  </div>
                )}
              </div>
            </>
          )}

          {innerTab === 'notes' && (
            <>
              <div className="card">
                <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Your Notes & Observations</p>
                {p.notes.map((n, i) => (
                  <div key={i} style={{ padding: '12px 0', borderBottom: i < p.notes.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
                    <p style={{ fontSize: 10, color: '#555', marginBottom: 5 }}>{n.date}</p>
                    <p style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>{n.text}</p>
                  </div>
                ))}
              </div>
              <div className="card" style={{ borderColor: `${p.color}25`, background: `${p.color}06` }}>
                <p style={{ fontSize: 12, color: '#888', marginBottom: 10 }}>Add a note for today</p>
                <textarea placeholder={`How is ${p.name} working for you?`} rows={3} style={{
                  width: '100%', background: '#181818', border: '1px solid #2a2a2a',
                  borderRadius: 10, padding: '10px 12px', fontSize: 13, color: '#f0f0f0',
                  outline: 'none', fontFamily: 'inherit', resize: 'none',
                }} />
                <button style={{ marginTop: 10, width: '100%', padding: '11px', borderRadius: 10, fontSize: 13, fontWeight: 700, background: `${p.color}20`, color: p.color, border: `1px solid ${p.color}35` }}>
                  Save Note
                </button>
              </div>
            </>
          )}

          {innerTab === 'research' && (
            <>
              <div className="card">
                <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Mechanism of Action</p>
                <p style={{ fontSize: 12, color: '#888', lineHeight: 1.7 }}>{p.research.mechanism}</p>
              </div>
              <div className="card">
                <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Primary Benefits</p>
                {p.research.primaryBenefits.map(b => (
                  <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #1a1a1a' }}>
                    <span style={{ color: p.color, fontSize: 12 }}>●</span>
                    <span style={{ fontSize: 12, color: '#ccc' }}>{b}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { l: 'Evidence', v: p.research.evidenceLevel, color: '#f5a623' },
                  { l: 'Half-life', v: p.research.halfLife, color: '#60a5fa' },
                ].map(m => (
                  <div key={m.l} className="card" style={{ padding: 14 }}>
                    <p style={{ fontSize: 9, color: '#555', fontWeight: 700, marginBottom: 5 }}>{m.l.toUpperCase()}</p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: m.color, lineHeight: 1.4 }}>{m.v}</p>
                  </div>
                ))}
              </div>
              <div className="card" style={{ borderColor: '#f5a62325', background: '#f5a62308' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#f5a623', marginBottom: 8 }}>📋 Protocol Notes</p>
                <p style={{ fontSize: 12, color: '#888', lineHeight: 1.6 }}>{p.research.protocolNotes}</p>
              </div>
              <div className="card" style={{ borderColor: '#ef444425', background: '#ef444408' }}>
                <p style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, marginBottom: 6 }}>⚠️ Disclaimer</p>
                <p style={{ fontSize: 11, color: '#666', lineHeight: 1.6 }}>Research purposes only. Consult a licensed physician before use. Not FDA-approved for the indications described.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Today tab ───────────────────────────────────────────────────────────────
function TodayTab() {
  const [peptides, setPeptides] = useState(todayStats.peptides);
  const [supps, setSupps]       = useState(supplementProfiles);
  const [caffeine, setCaffeine] = useState(caffeineProfile.todayEntries);
  const [lmnt, setLmnt]         = useState(electrolyteProfile.todayPackets);
  const [testLogged, setTestLogged] = useState(false);
  const [feelRatings, setFeelRatings] = useState({});

  const allItems = [...peptides, ...supps, ...caffeine, ...lmnt];
  const loggedCount = allItems.filter(x => x.logged).length + (testLogged ? 1 : 0);
  const totalCount  = allItems.length + 1;
  const adherence   = Math.round((loggedCount / totalCount) * 100);

  function setFeel(id, val) { setFeelRatings(p => ({ ...p, [id]: val })); }

  function Section({ title, icon, items, color, onToggle, extra }) {
    return (
      <div className="card">
        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>{icon} {title}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(item => (
            <div key={item.id}>
              <div onClick={() => onToggle(item.id)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
                background: item.logged ? `${item.color || color}12` : '#181818',
                border: `1px solid ${item.logged ? (item.color || color) + '35' : '#222'}`,
                transition: 'all 0.15s',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {item.icon && <span style={{ fontSize: 15 }}>{item.icon}</span>}
                    <p style={{ fontWeight: 700, fontSize: 13, color: item.logged ? (item.color || color) : '#f0f0f0' }}>{item.name || item.source}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 3, flexWrap: 'wrap' }}>
                    <p style={{ fontSize: 10, color: '#555' }}>{item.dose || (item.amount ? `${item.amount}mg` : item.packets ? `${item.packets} packet${item.packets > 1 ? 's' : ''}` : '')}</p>
                    {item.timing && <p style={{ fontSize: 10, color: '#444' }}>· {item.timing}</p>}
                    {item.time && <p style={{ fontSize: 10, color: '#444' }}>· {item.time}</p>}
                    {item.timeLogged && item.logged && <p style={{ fontSize: 10, color: '#2ef88b55' }}>✓ {item.timeLogged}</p>}
                    {item.context && <p style={{ fontSize: 10, color: '#444' }}>· {item.context}</p>}
                    {item.purpose && <p style={{ fontSize: 10, color: '#444' }}>· {item.purpose.split(',')[0]}</p>}
                    {item.flavor && <p style={{ fontSize: 10, color: '#444' }}>· {item.flavor}</p>}
                  </div>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, marginLeft: 8, background: item.logged ? (item.color || color) : '#1e1e1e', border: `2px solid ${item.logged ? (item.color || color) : '#333'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#000', transition: 'all 0.2s' }}>
                  {item.logged ? '✓' : ''}
                </div>
              </div>
              {/* Feel rating on logged items */}
              {item.logged && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 4, marginBottom: 2 }}>
                  {FEEL.map((e, i) => (
                    <button key={i} onClick={() => setFeel(item.id, i + 1)} style={{
                      fontSize: 16, background: feelRatings[item.id] === i + 1 ? '#2ef88b20' : 'transparent',
                      border: `1px solid ${feelRatings[item.id] === i + 1 ? '#2ef88b50' : 'transparent'}`,
                      borderRadius: 8, padding: '3px 6px', cursor: 'pointer',
                    }}>{e}</button>
                  ))}
                  <span style={{ fontSize: 10, color: '#444', display: 'flex', alignItems: 'center', marginLeft: 4 }}>feel?</span>
                </div>
              )}
            </div>
          ))}
          {extra}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Adherence */}
      <div className="card" style={{ textAlign: 'center', padding: '18px 20px' }}>
        <p style={{ fontSize: 10, color: '#555', fontWeight: 700, letterSpacing: '0.8px' }}>TODAY'S ADHERENCE</p>
        <p style={{ fontSize: 48, fontWeight: 900, color: adherence >= 80 ? '#2ef88b' : adherence >= 60 ? '#f5a623' : '#ef4444', marginTop: 4, letterSpacing: '-2px', lineHeight: 1 }}>{adherence}%</p>
        <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{loggedCount} of {totalCount} items logged</p>
      </div>

      {/* Peptides */}
      <Section title="Peptides" icon="💉" color="#2ef88b" items={peptides}
        onToggle={id => setPeptides(p => p.map(x => x.id === id ? { ...x, logged: !x.logged } : x))} />

      {/* Testosterone */}
      <div className="card">
        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>🧪 Testosterone</p>
        <div onClick={() => setTestLogged(v => !v)} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
          background: testLogged ? '#f5a62312' : '#181818',
          border: `1px solid ${testLogged ? '#f5a62335' : '#222'}`, transition: 'all 0.15s',
        }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: 13, color: testLogged ? '#f5a623' : '#f0f0f0' }}>
              {testosteroneProfile.compound}
            </p>
            <p style={{ fontSize: 10, color: '#555', marginTop: 3 }}>
              {testosteroneProfile.weeklyDose}mg · {testosteroneProfile.route} · {testosteroneProfile.dayOfWeek}
            </p>
            <p style={{ fontSize: 10, color: '#444', marginTop: 2 }}>Site: {testosteroneProfile.injectionSite}</p>
          </div>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: testLogged ? '#f5a623' : '#1e1e1e', border: `2px solid ${testLogged ? '#f5a623' : '#333'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#000', transition: 'all 0.2s' }}>
            {testLogged ? '✓' : ''}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10, padding: '0 4px' }}>
          {[['Total T', `${testosteroneProfile.labs.totalT} ng/dL`, '#f5a623'],
            ['Free T', `${testosteroneProfile.labs.freeT} pg/mL`, '#60a5fa'],
            ['E2', `${testosteroneProfile.labs.estradiol} pg/mL`, '#ec4899'],
          ].map(([l, v, c]) => (
            <div key={l} style={{ flex: 1, background: '#181818', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
              <p style={{ fontSize: 9, color: '#555', fontWeight: 700, marginBottom: 3 }}>{l}</p>
              <p style={{ fontSize: 12, fontWeight: 800, color: c }}>{v}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 10, color: '#444', marginTop: 8, textAlign: 'center' }}>Labs from {testosteroneProfile.labs.lastLabDate} · Next injection: {testosteroneProfile.dayOfWeek}</p>
      </div>

      {/* Caffeine */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p style={{ fontWeight: 700, fontSize: 15 }}>☕ Caffeine</p>
          <span style={{ fontSize: 12, color: '#f5a623', fontWeight: 700 }}>
            {caffeine.filter(c => c.logged).reduce((s, c) => s + c.amount, 0)}mg today
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {caffeine.map(c => (
            <div key={c.id} onClick={() => setCaffeine(prev => prev.map(x => x.id === c.id ? { ...x, logged: !x.logged } : x))} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '11px 14px', borderRadius: 12, cursor: 'pointer',
              background: c.logged ? '#f5a62312' : '#181818',
              border: `1px solid ${c.logged ? '#f5a62335' : '#222'}`, transition: 'all 0.15s',
            }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: 13, color: c.logged ? '#f5a623' : '#f0f0f0' }}>{c.source}</p>
                <p style={{ fontSize: 10, color: '#555', marginTop: 3 }}>{c.amount}mg · {c.time}</p>
              </div>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: c.logged ? '#f5a623' : '#1e1e1e', border: `2px solid ${c.logged ? '#f5a623' : '#333'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#000' }}>
                {c.logged ? '✓' : ''}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 10, background: '#181818' }}>
          <p style={{ fontSize: 11, color: '#555' }}>
            Caffeine after 2 PM → avg <span style={{ color: '#ef4444', fontWeight: 700 }}>−8ms HRV</span> · <span style={{ color: '#ef4444', fontWeight: 700 }}>−11%</span> sleep score
          </p>
        </div>
      </div>

      {/* LMNT / Electrolytes */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p style={{ fontWeight: 700, fontSize: 15 }}>🧂 Electrolytes</p>
          <span style={{ fontSize: 11, color: '#60a5fa', fontWeight: 700 }}>{electrolyteProfile.brand}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {lmnt.map(l => (
            <div key={l.id} onClick={() => setLmnt(prev => prev.map(x => x.id === l.id ? { ...x, logged: !x.logged } : x))} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '11px 14px', borderRadius: 12, cursor: 'pointer',
              background: l.logged ? '#60a5fa12' : '#181818',
              border: `1px solid ${l.logged ? '#60a5fa35' : '#222'}`, transition: 'all 0.15s',
            }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: 13, color: l.logged ? '#60a5fa' : '#f0f0f0' }}>{l.flavor}</p>
                <p style={{ fontSize: 10, color: '#555', marginTop: 3 }}>{l.packets} packet · {l.time} · {l.context}</p>
                <p style={{ fontSize: 10, color: '#444', marginTop: 2 }}>Na 1000mg · K 200mg · Mg 60mg</p>
              </div>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: l.logged ? '#60a5fa' : '#1e1e1e', border: `2px solid ${l.logged ? '#60a5fa' : '#333'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#000' }}>
                {l.logged ? '✓' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supplements */}
      <Section title="Supplements" icon="💊" color="#2ef88b" items={supps}
        onToggle={id => setSupps(p => p.map(x => x.id === id ? { ...x, logged: !x.logged } : x))} />
    </div>
  );
}

// ─── Stack tab ───────────────────────────────────────────────────────────────
function StackTab() {
  const [selected, setSelected] = useState(null);

  if (selected) return <PeptideDetail p={selected} onClose={() => setSelected(null)} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Testosterone card */}
      <div className="card" style={{ borderColor: '#f5a62330', background: '#f5a62306' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>🧪</span>
            <div>
              <p style={{ fontWeight: 800, fontSize: 15, color: '#f5a623' }}>{testosteroneProfile.compound}</p>
              <p style={{ fontSize: 11, color: '#555' }}>{testosteroneProfile.cycleType} · {testosteroneProfile.weeklyDose}mg/wk</p>
            </div>
          </div>
          <Tag color="#f5a623">Active</Tag>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {[['Total T', `${testosteroneProfile.labs.totalT}`, 'ng/dL', '#f5a623'],
            ['Free T', `${testosteroneProfile.labs.freeT}`, 'pg/mL', '#60a5fa'],
            ['E2', `${testosteroneProfile.labs.estradiol}`, 'pg/mL', '#ec4899'],
            ['SHBG', `${testosteroneProfile.labs.shbg}`, 'nmol/L', '#a78bfa'],
          ].map(([l, v, u, c]) => (
            <div key={l} style={{ background: '#111', borderRadius: 8, padding: '8px 6px', textAlign: 'center' }}>
              <p style={{ fontSize: 8, color: '#555', fontWeight: 700, marginBottom: 3 }}>{l}</p>
              <p style={{ fontSize: 13, fontWeight: 800, color: c }}>{v}</p>
              <p style={{ fontSize: 8, color: '#444' }}>{u}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {testosteroneProfile.supportCompounds.map(s => (
            <div key={s.name} style={{ padding: '5px 10px', borderRadius: 8, background: '#1e1e1e', border: '1px solid #2a2a2a' }}>
              <span style={{ fontSize: 10, color: '#888', fontWeight: 600 }}>{s.name} {s.dose} · {s.purpose}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <div style={{ flex: 1, background: '#f5a62310', borderRadius: 8, padding: '8px 12px', border: '1px solid #f5a62325' }}>
            <p style={{ fontSize: 9, color: '#555', fontWeight: 700, marginBottom: 3 }}>ON TRT vs BASELINE</p>
            <p style={{ fontSize: 13, color: '#2ef88b', fontWeight: 700 }}>HRV +{testosteroneProfile.metricsOn.hrv - testosteroneProfile.metricsBaseline.hrv}ms · Recovery +{testosteroneProfile.metricsOn.recovery - testosteroneProfile.metricsBaseline.recovery}%</p>
          </div>
        </div>
      </div>

      {/* Peptide cards */}
      {peptideProfiles.map(p => (
        <div key={p.id} onClick={() => setSelected(p)} className="card" style={{ cursor: 'pointer', borderColor: `${p.color}25`, background: `${p.color}05`, transition: 'border-color 0.15s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>{p.icon}</span>
              <div>
                <p style={{ fontWeight: 800, fontSize: 15, color: p.color }}>{p.name}</p>
                <p style={{ fontSize: 11, color: '#555' }}>{p.category}</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Tag color={p.protocol.status === 'active' ? '#2ef88b' : p.protocol.status === 'as-needed' ? '#f5a623' : '#555'}>
                {p.protocol.status === 'active' ? `Day ${p.protocol.cycleDay}` : p.protocol.status === 'as-needed' ? 'As needed' : 'Break'}
              </Tag>
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <div style={{ background: '#181818', borderRadius: 8, padding: '6px 10px' }}>
              <p style={{ fontSize: 9, color: '#555', fontWeight: 700 }}>DOSE</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#f0f0f0', marginTop: 2 }}>{p.protocol.dose}</p>
            </div>
            <div style={{ background: '#181818', borderRadius: 8, padding: '6px 10px' }}>
              <p style={{ fontSize: 9, color: '#555', fontWeight: 700 }}>ROUTE</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#f0f0f0', marginTop: 2 }}>{p.protocol.route}</p>
            </div>
            {p.metricsOn && (
              <div style={{ background: `${p.color}12`, borderRadius: 8, padding: '6px 10px', border: `1px solid ${p.color}25` }}>
                <p style={{ fontSize: 9, color: '#555', fontWeight: 700 }}>HRV ON DAYS</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: p.color, marginTop: 2 }}>+{p.metricsOn.hrv - p.metricsOff.hrv}ms</p>
              </div>
            )}
            <div style={{ background: '#181818', borderRadius: 8, padding: '6px 10px' }}>
              <p style={{ fontSize: 9, color: '#555', fontWeight: 700 }}>RATING</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#f5a623', marginTop: 2 }}>{p.effectivenessRating}/10</p>
            </div>
          </div>

          {/* Feel sparkline */}
          <FeelSpark history={p.feelHistory} />

          {/* Latest note */}
          {p.notes.length > 0 && (
            <p style={{ fontSize: 11, color: '#555', marginTop: 8, fontStyle: 'italic', lineHeight: 1.5 }}>
              "{p.notes[p.notes.length - 1].text.slice(0, 80)}..."
            </p>
          )}

          <p style={{ fontSize: 10, color: p.color + '80', marginTop: 8, textAlign: 'right' }}>Tap for full profile →</p>
        </div>
      ))}
    </div>
  );
}

// ─── Tracker tab (calendar grid) ─────────────────────────────────────────────
function TrackerTab() {
  const peptideKeys = [
    { key: 'bpc157',    name: 'BPC', color: '#2ef88b' },
    { key: 'tb500',     name: 'TB',  color: '#60a5fa' },
    { key: 'sermorelin',name: 'SRM', color: '#a78bfa' },
    { key: 'pt141',     name: 'PT',  color: '#f5a623' },
  ];

  const last21 = peptideCalendar.slice(-21);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="card">
        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>21-Day Adherence Calendar</p>
        <p style={{ fontSize: 11, color: '#555', marginBottom: 16 }}>Filled = dosed · Empty = skipped</p>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          {peptideKeys.map(pk => (
            <div key={pk.key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: pk.color }} />
              <span style={{ fontSize: 11, color: '#888' }}>{pk.name}</span>
            </div>
          ))}
        </div>

        {/* Grid: rows = peptides, cols = days */}
        {peptideKeys.map(pk => {
          const taken = last21.filter(d => d[pk.key]).length;
          const pct = Math.round((taken / last21.length) * 100);
          return (
            <div key={pk.key} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: pk.color, minWidth: 36 }}>{pk.name}</span>
                <span style={{ fontSize: 11, color: '#555' }}>{pct}% adherence</span>
              </div>
              <div style={{ display: 'flex', gap: 3 }}>
                {last21.map((day, i) => (
                  <div key={i} style={{
                    flex: 1, height: 24, borderRadius: 4,
                    background: day[pk.key] ? pk.color : '#1a1a1a',
                    opacity: day[pk.key] ? 0.9 : 0.4,
                    border: `1px solid ${day[pk.key] ? pk.color + '40' : '#222'}`,
                  }} title={day.date} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Date labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 9, color: '#444' }}>{last21[0].date.slice(5)}</span>
          <span style={{ fontSize: 9, color: '#444' }}>Today</span>
        </div>
      </div>

      {/* Adherence summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {peptideProfiles.map(p => (
          <div key={p.id} className="card" style={{ padding: '14px 16px', borderColor: `${p.color}25` }}>
            <p style={{ fontSize: 10, color: '#555', fontWeight: 700, letterSpacing: '0.4px', marginBottom: 5 }}>{p.name.toUpperCase()}</p>
            <p style={{ fontSize: 24, fontWeight: 900, color: p.color }}>{p.adherence ?? '—'}<span style={{ fontSize: 11, color: '#555' }}>{p.adherence ? '%' : ''}</span></p>
            <p style={{ fontSize: 10, color: '#444', marginTop: 3 }}>{p.protocol.status === 'as-needed' ? 'As needed' : `${p.protocol.cycleDay}d of cycle`}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AI Recs tab ─────────────────────────────────────────────────────────────
function RecsTab() {
  const recs = [
    {
      name: 'CJC-1295 + Ipamorelin', icon: '⚡', color: '#f5a623', priority: 'CONSIDER',
      reason: `Stack with Sermorelin or replace it. The GHRH/GHRP combination gives a larger, more sustained GH pulse. Your current HRV (${recovery.hrv}ms) and sleep score (${sleep.score}%) would likely improve further with optimized GH release.`,
      dose: 'CJC-1295 100mcg + Ipa 200mcg', timing: 'Before bed',
    },
    {
      name: 'Epithalon', icon: '🧬', color: '#ec4899', priority: 'CONSIDER',
      reason: `Telomere-extending tetrapeptide. Based on your strong protocol commitment, adding a periodic Epithalon cycle (10 days, 1–2× yearly) could support long-term cellular health, melatonin regulation, and cardiovascular efficiency.`,
      dose: '5–10mg/day', timing: '10-day cycle, 2× yearly',
    },
    {
      name: 'GHK-Cu', icon: '🩹', color: '#60a5fa', priority: 'MODERATE',
      reason: `Copper peptide for skin, hair, and collagen synthesis. Synergizes with BPC-157 and TB-500 for connective tissue repair. Worth adding to your healing stack.`,
      dose: '1–2mg', timing: 'SubQ or topical daily',
    },
    {
      name: 'Selank / Semax', icon: '🧠', color: '#a78bfa', priority: 'CONSIDER',
      reason: `Nootropic peptides that reduce anxiety and enhance BDNF. Based on stress levels in your journal, these could help lower cortisol, improve focus, and support HRV normalization on high-strain days.`,
      dose: '100–250mcg each', timing: 'Morning nasal',
    },
  ];

  const priorityColors = { HIGH: '#ef4444', MODERATE: '#f5a623', CONSIDER: '#60a5fa' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="card" style={{ background: '#2ef88b08', borderColor: '#2ef88b20' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#2ef88b', marginBottom: 6 }}>🤖 AI Stack Analysis</p>
        <p style={{ fontSize: 12, color: '#888', lineHeight: 1.6 }}>
          Based on your HRV ({recovery.hrv}ms vs {recovery.hrv30dAvg}ms baseline), recovery ({recovery.score}%), sleep ({sleep.score}%), and your current stack (BPC-157 day {peptideProfiles[0].protocol.cycleDay}, TB-500, Sermorelin, PT-141), here are the next best additions or adjustments.
        </p>
      </div>

      {recs.map((r, i) => (
        <div key={i} className="card" style={{ borderColor: `${r.color}25`, background: `${r.color}06` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22 }}>{r.icon}</span>
              <p style={{ fontWeight: 800, fontSize: 15, color: r.color }}>{r.name}</p>
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.8px', color: priorityColors[r.priority], background: `${priorityColors[r.priority]}15`, border: `1px solid ${priorityColors[r.priority]}30`, padding: '3px 9px', borderRadius: 6 }}>
              {r.priority}
            </span>
          </div>
          <p style={{ fontSize: 12, color: '#888', lineHeight: 1.6, marginBottom: 12 }}>{r.reason}</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ background: '#1e1e1e', borderRadius: 8, padding: '5px 10px', fontSize: 11, color: '#666' }}>💊 {r.dose}</span>
            <span style={{ background: '#1e1e1e', borderRadius: 8, padding: '5px 10px', fontSize: 11, color: '#666' }}>⏰ {r.timing}</span>
          </div>
        </div>
      ))}

      <div className="card" style={{ borderColor: '#ef444430', background: '#ef444408' }}>
        <p style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, marginBottom: 5 }}>⚠️ Disclaimer</p>
        <p style={{ fontSize: 11, color: '#666', lineHeight: 1.6 }}>Informational only. Consult a licensed physician before using any compounds. Not FDA-approved for these indications.</p>
      </div>
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────
export default function PeptidesView() {
  const [tab, setTab] = useState('today');

  const tabs = [
    { key: 'today', label: '📋 Today' },
    { key: 'stack', label: '💊 Stack' },
    { key: 'tracker', label: '📅 Tracker' },
    { key: 'ai', label: '🤖 Coach' },
  ];

  return (
    <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ padding: '20px 0 6px' }}>
        <p style={{ fontSize: 11, color: '#555', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>My Protocol</p>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>Stack & Supplements</h1>
      </div>

      <div style={{ display: 'flex', gap: 5, background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 4 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: '9px 0', borderRadius: 9, fontSize: 11, fontWeight: 700,
            background: tab === t.key ? '#2ef88b' : 'transparent',
            color: tab === t.key ? '#000' : '#666', transition: 'all 0.2s',
          }}>{t.label}</button>
        ))}
      </div>

      <div className="animate-fade-up">
        {tab === 'today'   && <TodayTab />}
        {tab === 'stack'   && <StackTab />}
        {tab === 'tracker' && <TrackerTab />}
        {tab === 'ai'      && <RecsTab />}
      </div>
    </div>
  );
}
