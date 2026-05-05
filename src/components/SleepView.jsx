import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { sleepHistory, sleepDebt30d, todayStats } from '../data/mockData';

const { sleep } = todayStats;

const stageColors = { slow_wave: '#2ef88b', rem: '#a78bfa', light: '#60a5fa', awake: '#ef4444' };
const stageLabels = { slow_wave: 'SWS', rem: 'REM', light: 'Light', awake: 'Awake' };

const TT = ({ active, payload, label, unit = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: 10, padding: '8px 12px' }}>
      <p style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ fontSize: 12, color: p.color || '#f0f0f0', fontWeight: 600 }}>
          {p.name}: {p.value}{unit}
        </p>
      ))}
    </div>
  );
};

// Convert 12h time string → minutes since midnight
function timeToMin(t) {
  const [time, period] = t.split(' ');
  let [h, m] = time.split(':').map(Number);
  if (period === 'AM' && h === 12) h = 0;
  if (period === 'PM' && h !== 12) h += 12;
  return h * 60 + m;
}

function Hypnogram({ segments, startTime }) {
  const total = segments.reduce((s, x) => s + x.minutes, 0);
  const startMin = timeToMin(startTime);

  // Build time labels every ~90 min
  const labels = [];
  let acc = 0;
  segments.forEach(seg => {
    const t = startMin + acc;
    labels.push({ pct: acc / total, label: formatMin(t % (24 * 60)) });
    acc += seg.minutes;
  });
  // De-duplicate by pct threshold
  const shown = labels.filter((l, i) => i === 0 || l.pct - labels[i - 1].pct > 0.15);

  return (
    <div>
      {/* Stage rows (WHOOP-style grid) */}
      {['awake', 'rem', 'light', 'slow_wave'].map(stage => (
        <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 9, color: '#444', fontWeight: 600, width: 26, textAlign: 'right', flexShrink: 0 }}>
            {stageLabels[stage]}
          </span>
          <div style={{ flex: 1, height: 14, display: 'flex', gap: 1, borderRadius: 3, overflow: 'hidden', background: '#0f0f0f' }}>
            {segments.map((seg, i) => (
              <div key={i} style={{
                flex: seg.minutes,
                background: seg.stage === stage ? stageColors[stage] : 'transparent',
                opacity: 0.9,
              }} />
            ))}
          </div>
        </div>
      ))}
      {/* Time labels */}
      <div style={{ display: 'flex', marginTop: 4, paddingLeft: 34 }}>
        {shown.map((l, i) => (
          <div key={i} style={{ position: 'absolute', left: `calc(34px + ${l.pct * (100 - 5)}%)`, fontSize: 9, color: '#444' }}>
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatMin(totalMin) {
  const h = Math.floor(totalMin / 60) % 24;
  const m = totalMin % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  return `${((h % 12) || 12)}:${m.toString().padStart(2, '0')} ${period}`;
}

export default function SleepView() {
  const [tab, setTab] = useState('last');
  const chartData = sleepHistory.map(d => ({ date: d.date.slice(5), duration: d.duration, score: d.score, rem: d.rem, sws: d.sws, need: d.need }));
  const debtData   = sleepDebt30d.slice(-14).map(d => ({ date: d.date.slice(5), debt: d.debt }));
  const totalStage = Object.values(sleep.stages).reduce((a, b) => a + b, 0);
  const restorative = +(sleep.stages.slow_wave + sleep.stages.rem).toFixed(1);
  const restorativePct = Math.round((restorative / totalStage) * 100);

  const perfPct  = Math.round((sleep.duration / sleep.need) * 100);
  const perfColor = perfPct >= 85 ? '#2ef88b' : perfPct >= 70 ? '#f5a623' : '#ef4444';

  return (
    <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ padding: '20px 0 6px' }}>
        <p style={{ fontSize: 11, color: '#555', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Last Night</p>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>Sleep Analysis</h1>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 6, background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 4 }}>
        {[['last','Last Night'],['trends','7-Day'],['debt','Sleep Debt']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            flex: 1, padding: '9px 0', borderRadius: 9, fontSize: 12, fontWeight: 700,
            background: tab === k ? '#a78bfa' : 'transparent',
            color: tab === k ? '#000' : '#666', transition: 'all 0.2s',
          }}>{l}</button>
        ))}
      </div>

      {tab === 'last' && (
        <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Score hero */}
          <div className="card" style={{ textAlign: 'center', padding: '24px 20px' }}>
            <div style={{ fontSize: 72, fontWeight: 900, color: '#a78bfa', letterSpacing: '-3px', lineHeight: 1 }}>{sleep.score}</div>
            <p style={{ fontSize: 11, color: '#555', letterSpacing: '2px', marginTop: 4 }}>SLEEP SCORE</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 18 }}>
              {[
                { label: 'Duration',    val: `${sleep.duration}h`,   color: '#f0f0f0' },
                { label: 'In Bed',      val: `${sleep.timeInBed}h`,  color: '#f0f0f0' },
                { label: 'Efficiency',  val: `${sleep.efficiency}%`, color: '#a78bfa' },
                { label: 'Cycles',      val: sleep.cyclesComplete,   color: '#60a5fa' },
              ].map(m => (
                <div key={m.label}>
                  <p style={{ fontSize: 10, color: '#555', fontWeight: 600 }}>{m.label.toUpperCase()}</p>
                  <p style={{ fontSize: 17, fontWeight: 800, color: m.color, marginTop: 3 }}>{m.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sleep performance vs need */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <p style={{ fontWeight: 700, fontSize: 15 }}>Sleep Performance</p>
              <p style={{ fontSize: 20, fontWeight: 900, color: perfColor }}>{perfPct}%</p>
            </div>
            <div style={{ height: 12, borderRadius: 6, background: '#1e1e1e', overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ width: `${Math.min(perfPct, 100)}%`, height: '100%', background: perfColor, borderRadius: 6, boxShadow: `0 0 8px ${perfColor}55`, transition: 'width 1s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: '#555' }}>Got {sleep.duration}h</span>
              <span style={{ fontSize: 11, color: '#555' }}>Needed {sleep.need}h</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <div style={{ flex: 1, background: '#181818', borderRadius: 10, padding: '10px 12px' }}>
                <p style={{ fontSize: 9, color: '#555', fontWeight: 700, marginBottom: 4 }}>RESTORATIVE</p>
                <p style={{ fontSize: 18, fontWeight: 800, color: '#2ef88b' }}>{restorative}h <span style={{ fontSize: 11, color: '#555' }}>({restorativePct}%)</span></p>
              </div>
              <div style={{ flex: 1, background: '#181818', borderRadius: 10, padding: '10px 12px' }}>
                <p style={{ fontSize: 9, color: '#555', fontWeight: 700, marginBottom: 4 }}>CONSISTENCY</p>
                <p style={{ fontSize: 18, fontWeight: 800, color: '#60a5fa' }}>{sleep.consistency}%</p>
              </div>
            </div>
          </div>

          {/* Bedtime + wake */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 10, color: '#555', fontWeight: 700, letterSpacing: '0.5px' }}>BEDTIME</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: '#f0f0f0', marginTop: 3 }}>{sleep.startTime}</p>
              </div>
              <div style={{ color: '#333', display: 'flex', alignItems: 'center', fontSize: 18 }}>→</div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 10, color: '#555', fontWeight: 700, letterSpacing: '0.5px' }}>WAKE TIME</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: '#f0f0f0', marginTop: 3 }}>{sleep.endTime}</p>
              </div>
            </div>

            {/* Hypnogram */}
            <p style={{ fontSize: 10, color: '#444', fontWeight: 700, letterSpacing: '0.5px', marginBottom: 8 }}>SLEEP STAGES</p>
            <div style={{ position: 'relative' }}>
              <Hypnogram segments={sleep.hypnogram} startTime={sleep.startTime} />
            </div>

            {/* Stage legend + stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
              {Object.entries(sleep.stages).map(([stage, hrs]) => (
                <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#181818', borderRadius: 8, padding: '8px 10px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: stageColors[stage], flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 10, color: '#555', fontWeight: 600 }}>{stageLabels[stage]}</p>
                    <p style={{ fontSize: 14, fontWeight: 800, color: stageColors[stage] }}>{hrs}h <span style={{ fontSize: 9, color: '#444' }}>({Math.round((hrs / totalStage) * 100)}%)</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vitals during sleep */}
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { label: 'HR During Sleep', val: sleep.hrDuringSleep, unit: 'bpm', color: '#ef4444' },
              { label: 'Resp Rate',       val: sleep.respiratoryRate, unit: 'brpm', color: '#60a5fa' },
              { label: 'Disturbances',    val: sleep.disturbances, unit: '', color: '#f5a623' },
            ].map(m => (
              <div key={m.label} className="card" style={{ flex: 1, padding: 14, textAlign: 'center' }}>
                <p style={{ fontSize: 9, color: '#555', fontWeight: 700, letterSpacing: '0.4px' }}>{m.label.toUpperCase()}</p>
                <p style={{ fontSize: 22, fontWeight: 800, color: m.color, marginTop: 6 }}>{m.val}<span style={{ fontSize: 10, color: '#555', marginLeft: 2 }}>{m.unit}</span></p>
              </div>
            ))}
          </div>

          {/* Insight */}
          <div className="card" style={{ borderColor: '#a78bfa30', background: '#a78bfa08' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#a78bfa', marginBottom: 8 }}>💡 Sleep Insight</p>
            <p style={{ fontSize: 12, color: '#888', lineHeight: 1.6 }}>
              Your REM sleep ({sleep.stages.rem}h) and SWS ({sleep.stages.slow_wave}h) combined for {restorative}h of restorative sleep.
              {sleep.debt > 2 ? ` You're carrying ${sleep.debt}h of sleep debt — prioritize getting to bed earlier tonight.` : ' Sleep debt is manageable.'}
              {sleep.consistency < 85 ? ' Try keeping your bedtime within 30 minutes of consistency for better HRV.' : ''}
            </p>
          </div>
        </div>
      )}

      {tab === 'trends' && (
        <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Sleep Duration vs Need</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} barSize={20} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                <Tooltip content={<TT unit="h" />} cursor={{ fill: '#ffffff06' }} />
                <Bar dataKey="duration" name="Got" fill="#a78bfa" radius={[6,6,0,0]} opacity={0.85} />
                <Bar dataKey="need"     name="Need" fill="#2a2a2a" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Sleep Score</p>
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={chartData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                <Tooltip content={<TT unit="%" />} cursor={{ stroke: '#ffffff15' }} />
                <ReferenceLine y={85} stroke="#2ef88b" strokeDasharray="3 3" opacity={0.4} />
                <Area type="monotone" dataKey="score" stroke="#a78bfa" strokeWidth={2.5} fill="url(#sg)" name="Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>REM & SWS</p>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={chartData} barSize={16} barGap={3} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 3]} tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                <Tooltip content={<TT unit="h" />} cursor={{ fill: '#ffffff06' }} />
                <Bar dataKey="rem" name="REM"  fill="#a78bfa" radius={[4,4,0,0]} />
                <Bar dataKey="sws" name="SWS"  fill="#2ef88b" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: '#a78bfa' }}>● REM (ideal ≥1.5h)</span>
              <span style={{ fontSize: 11, color: '#2ef88b' }}>● SWS (ideal ≥1.5h)</span>
            </div>
          </div>
        </div>
      )}

      {tab === 'debt' && (
        <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ textAlign: 'center', padding: '24px 20px' }}>
            <p style={{ fontSize: 11, color: '#555', fontWeight: 700, letterSpacing: '1px' }}>CURRENT SLEEP DEBT</p>
            <p style={{ fontSize: 64, fontWeight: 900, color: sleep.debt > 3 ? '#ef4444' : sleep.debt > 1.5 ? '#f5a623' : '#2ef88b', letterSpacing: '-3px', marginTop: 6, lineHeight: 1 }}>{sleep.debt}h</p>
            <p style={{ fontSize: 12, color: '#666', marginTop: 6 }}>5-night rolling window</p>
            <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 12, background: '#181818' }}>
              <p style={{ fontSize: 12, color: '#888', lineHeight: 1.6 }}>
                {sleep.debt > 3
                  ? `Your debt is high. Sleep ${(sleep.debt / 3).toFixed(1)}h extra per night over 3 nights to clear it.`
                  : sleep.debt > 1.5
                  ? `Moderate debt. An extra 30–45 min tonight and tomorrow will recover it.`
                  : `Debt is low. You're well recovered — maintain your current sleep schedule.`}
              </p>
            </div>
          </div>
          <div className="card">
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>14-Day Sleep Debt</p>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={debtData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="debtGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#555' }} axisLine={false} tickLine={false} interval={2} />
                <YAxis domain={[0, 6]} tick={{ fontSize: 9, fill: '#555' }} axisLine={false} tickLine={false} />
                <Tooltip content={<TT unit="h" />} cursor={{ stroke: '#ffffff15' }} />
                <ReferenceLine y={1} stroke="#2ef88b" strokeDasharray="3 3" opacity={0.5} label={{ value: 'Optimal', fill: '#2ef88b55', fontSize: 9 }} />
                <Area type="monotone" dataKey="debt" name="Debt" stroke="#ef4444" strokeWidth={2} fill="url(#debtGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="card" style={{ borderColor: '#f5a62330', background: '#f5a62308' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#f5a623', marginBottom: 8 }}>💡 Debt Tips</p>
            {[
              'Sleep debt accumulates when you get less than your nightly need.',
              'You cannot pay it all back in one night — spread recovery across 3–5 nights.',
              'Naps (20–90 min) reduce debt without disrupting nightly sleep.',
              'High strain days increase your sleep need by 15–30 min.',
            ].map((t, i) => (
              <p key={i} style={{ fontSize: 11, color: '#777', lineHeight: 1.6, paddingLeft: 12, borderLeft: '2px solid #f5a62340', marginBottom: i < 3 ? 8 : 0 }}>{t}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
