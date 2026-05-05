import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts';
import { monthlyHRV, monthlyRHR, weeklyData, behaviorCorrelations, personalBests } from '../data/mockData';
import { useState } from 'react';

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

function StatCard({ label, value, unit, change, color, pb, subLabel }) {
  const up = parseFloat(change) > 0;
  const inverted = label.includes('RHR'); // lower is better for RHR
  const changeColor = inverted ? (up ? '#ef4444' : '#2ef88b') : (up ? '#2ef88b' : '#ef4444');
  return (
    <div className="card" style={{ flex: 1, padding: 16 }}>
      <p style={{ fontSize: 9, color: '#555', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 900, color, marginTop: 5, letterSpacing: '-1px' }}>
        {value}<span style={{ fontSize: 10, color: '#555', marginLeft: 2 }}>{unit}</span>
      </p>
      {change !== undefined && (
        <p style={{ fontSize: 10, color: changeColor, fontWeight: 700, marginTop: 3 }}>
          {up ? '↑' : '↓'} {Math.abs(change)}{unit} vs 7d
        </p>
      )}
      {pb && <p style={{ fontSize: 9, color: '#444', marginTop: 2 }}>PB: {pb}{unit}</p>}
    </div>
  );
}

export default function TrendsView() {
  const [period, setPeriod] = useState('7d');
  const [metricTab, setMetricTab] = useState('recovery');

  const sliceN = period === '30d' ? 30 : 7;
  const hrvData = monthlyHRV.slice(-sliceN).map(d => ({ ...d, date: period === '7d' ? d.date.slice(5) : d.date.slice(5) }));
  const rhrData = monthlyRHR.slice(-sliceN).map(d => ({ ...d, date: d.date.slice(5) }));
  const weekData = weeklyData.map(d => ({ ...d, date: d.date.slice(5) }));

  const sortedCorr = [...behaviorCorrelations].sort((a, b) => b.impact - a.impact);

  return (
    <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ padding: '20px 0 6px' }}>
        <p style={{ fontSize: 11, color: '#555', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Analytics</p>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>Trends & Insights</h1>
      </div>

      {/* Period toggle */}
      <div style={{ display: 'flex', gap: 6, background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 4 }}>
        {['7d','30d'].map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{
            flex: 1, padding: '9px 0', borderRadius: 9, fontSize: 13, fontWeight: 700,
            background: period === p ? '#2ef88b' : 'transparent',
            color: period === p ? '#000' : '#666', transition: 'all 0.2s',
          }}>{p === '7d' ? '7 Days' : '30 Days'}</button>
        ))}
      </div>

      {/* Stat row */}
      <div style={{ display: 'flex', gap: 8 }} className="animate-fade-up">
        <StatCard label="Avg HRV"  value={62} unit="ms"  change={+7}  color="#2ef88b" pb={personalBests.hrv} />
        <StatCard label="Avg RHR"  value={52} unit="bpm" change={-2}  color="#ef4444" pb={personalBests.rhr} />
        <StatCard label="Recovery" value={71} unit="%" change={+4}   color="#f5a623" pb={personalBests.recovery} />
      </div>

      {/* Personal bests */}
      <div className="card animate-fade-up">
        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Personal Records 🏆</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: 'Best HRV',        val: `${personalBests.hrv} ms`,           color: '#2ef88b' },
            { label: 'Lowest RHR',      val: `${personalBests.rhr} bpm`,          color: '#60a5fa' },
            { label: 'Best Recovery',   val: `${personalBests.recovery}%`,        color: '#f5a623' },
            { label: 'Best Sleep',      val: `${personalBests.sleepDuration}h`,   color: '#a78bfa' },
            { label: 'Sleep Score PR',  val: `${personalBests.sleepScore}%`,      color: '#a78bfa' },
            { label: 'Peak VO₂ Max',    val: `${personalBests.vo2max}`,            color: '#2ef88b' },
          ].map(m => (
            <div key={m.label} style={{ background: '#181818', borderRadius: 10, padding: '12px 14px' }}>
              <p style={{ fontSize: 9, color: '#555', fontWeight: 700, letterSpacing: '0.4px', marginBottom: 4 }}>{m.label.toUpperCase()}</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: m.color }}>{m.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Metric tabs */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {[['recovery','Recovery'],['hrv','HRV'],['rhr','RHR'],['sleep','Sleep']].map(([k,l]) => (
          <button key={k} onClick={() => setMetricTab(k)} style={{
            padding: '7px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700,
            background: metricTab === k ? '#2ef88b20' : '#111',
            color: metricTab === k ? '#2ef88b' : '#555',
            border: `1px solid ${metricTab === k ? '#2ef88b50' : '#1e1e1e'}`,
          }}>{l}</button>
        ))}
      </div>

      {/* ── Recovery ─────────────────────────────────────────────────────── */}
      {metricTab === 'recovery' && (
        <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card">
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Recovery Score</p>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={weekData} barSize={24} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                <Tooltip content={<TT unit="%" />} cursor={{ fill: '#ffffff06' }} />
                <ReferenceLine y={67} stroke="#2ef88b" strokeDasharray="3 3" opacity={0.5} />
                <ReferenceLine y={34} stroke="#ef4444" strokeDasharray="3 3" opacity={0.4} />
                <Bar dataKey="recovery" name="Recovery" radius={[6,6,0,0]}>
                  {weekData.map((d, i) => <Cell key={i} fill={d.recovery >= 67 ? '#2ef88b' : d.recovery >= 34 ? '#f5a623' : '#ef4444'} opacity={i === weekData.length - 1 ? 1 : 0.7} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 8 }}>
              <span style={{ fontSize: 10, color: '#2ef88b55' }}>— Green ≥67%</span>
              <span style={{ fontSize: 10, color: '#ef4444aa' }}>— Red &lt;34%</span>
            </div>
          </div>
          <div className="card">
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Sleep vs Strain vs Recovery</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={weekData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="pct" domain={[0, 100]} tick={{ fontSize: 9, fill: '#555' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="strain" orientation="right" domain={[0, 21]} tick={{ fontSize: 9, fill: '#555' }} axisLine={false} tickLine={false} />
                <Tooltip content={<TT />} cursor={{ stroke: '#ffffff15' }} />
                <Line yAxisId="pct" type="monotone" dataKey="recovery" stroke="#2ef88b" strokeWidth={2} dot={{ r: 3, fill: '#2ef88b' }} name="Recovery %" />
                <Line yAxisId="pct" type="monotone" dataKey="sleep"    stroke="#a78bfa" strokeWidth={2} dot={{ r: 3, fill: '#a78bfa' }} name="Sleep %" />
                <Line yAxisId="strain" type="monotone" dataKey="strain" stroke="#f5a623" strokeWidth={2} dot={{ r: 3, fill: '#f5a623' }} name="Strain" />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: '#2ef88b' }}>● Recovery</span>
              <span style={{ fontSize: 11, color: '#a78bfa' }}>● Sleep</span>
              <span style={{ fontSize: 11, color: '#f5a623' }}>● Strain</span>
            </div>
          </div>
        </div>
      )}

      {/* ── HRV ──────────────────────────────────────────────────────────── */}
      {metricTab === 'hrv' && (
        <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <p style={{ fontWeight: 700, fontSize: 15 }}>HRV Trend</p>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: '#2ef88b' }}>62 ms</p>
                <p style={{ fontSize: 10, color: '#555' }}>Baseline: 58 ms</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={hrvData} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2ef88b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2ef88b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#555' }} axisLine={false} tickLine={false} interval={period === '30d' ? 5 : 0} />
                <YAxis domain={[20, 100]} tick={{ fontSize: 9, fill: '#555' }} axisLine={false} tickLine={false} />
                <Tooltip content={<TT unit=" ms" />} cursor={{ stroke: '#ffffff15' }} />
                <ReferenceLine y={58} stroke="#2ef88b" strokeDasharray="4 4" opacity={0.5} label={{ value: 'baseline', fill: '#2ef88b55', fontSize: 9 }} />
                <Area type="monotone" dataKey="hrv" name="HRV" stroke="#2ef88b" strokeWidth={2.5} fill="url(#hg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="card" style={{ borderColor: '#2ef88b25', background: '#2ef88b06' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#2ef88b', marginBottom: 8 }}>💡 HRV Insight</p>
            {[
              'Your HRV is 4ms above your 30-day baseline — a positive sign of recovery.',
              'Morning HRV directly reflects last night\'s sleep quality and nervous system state.',
              'Consistent HRV >60ms suggests good cardiovascular fitness for your profile.',
              'Alcohol drops HRV by an avg of 14ms the following morning based on your log.',
            ].map((t, i) => (
              <p key={i} style={{ fontSize: 11, color: '#777', lineHeight: 1.6, marginBottom: 6 }}>• {t}</p>
            ))}
          </div>
        </div>
      )}

      {/* ── RHR ──────────────────────────────────────────────────────────── */}
      {metricTab === 'rhr' && (
        <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <p style={{ fontWeight: 700, fontSize: 15 }}>Resting Heart Rate</p>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: '#ef4444' }}>52 bpm</p>
                <p style={{ fontSize: 10, color: '#555' }}>Baseline: 53 bpm</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={rhrData} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#555' }} axisLine={false} tickLine={false} interval={period === '30d' ? 5 : 0} />
                <YAxis domain={[45, 65]} tick={{ fontSize: 9, fill: '#555' }} axisLine={false} tickLine={false} />
                <Tooltip content={<TT unit=" bpm" />} cursor={{ stroke: '#ffffff15' }} />
                <ReferenceLine y={53} stroke="#ef4444" strokeDasharray="4 4" opacity={0.5} />
                <Area type="monotone" dataKey="rhr" name="RHR" stroke="#ef4444" strokeWidth={2.5} fill="url(#rg)" />
              </AreaChart>
            </ResponsiveContainer>
            <p style={{ fontSize: 11, color: '#555', marginTop: 8 }}>Personal best: {personalBests.rhr} bpm · Lower = better cardiovascular fitness</p>
          </div>
        </div>
      )}

      {/* ── Sleep ─────────────────────────────────────────────────────────── */}
      {metricTab === 'sleep' && (
        <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card">
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Sleep Score & Duration</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={weekData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="score" domain={[50,100]} tick={{ fontSize: 9, fill: '#555' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="dur" orientation="right" domain={[4,10]} tick={{ fontSize: 9, fill: '#555' }} axisLine={false} tickLine={false} />
                <Tooltip content={<TT />} cursor={{ stroke: '#ffffff15' }} />
                <Line yAxisId="score" type="monotone" dataKey="sleep"    stroke="#a78bfa" strokeWidth={2.5} dot={{ r: 3, fill: '#a78bfa' }} name="Score %" />
                <Line yAxisId="dur"   type="monotone" dataKey="sleepDur" stroke="#60a5fa" strokeWidth={2}   dot={{ r: 3, fill: '#60a5fa' }} name="Duration h" />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: '#a78bfa' }}>● Score</span>
              <span style={{ fontSize: 11, color: '#60a5fa' }}>● Duration</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Behavior Correlations ──────────────────────────────────────────── */}
      <div className="card animate-fade-up">
        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Behavior Impact on Recovery</p>
        <p style={{ fontSize: 11, color: '#555', marginBottom: 14 }}>Based on {journalHistoryCount()} logged days</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sortedCorr.map(corr => {
            const isPositive = corr.impact > 0;
            const barWidth = Math.abs(corr.impact / 30) * 100;
            return (
              <div key={corr.behavior}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 16 }}>{corr.icon}</span>
                    <span style={{ fontSize: 12, color: '#ddd', fontWeight: 500 }}>{corr.behavior}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, color: '#444' }}>n={corr.sampleSize}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: corr.color, minWidth: 36, textAlign: 'right' }}>
                      {isPositive ? '+' : ''}{corr.impact}%
                    </span>
                  </div>
                </div>
                <div style={{ height: 6, background: '#1a1a1a', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    width: `${barWidth}%`, height: '100%', borderRadius: 3,
                    background: corr.color, opacity: 0.8,
                    marginLeft: isPositive ? 0 : 'auto',
                    transition: 'width 0.8s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

function journalHistoryCount() { return 30; }
