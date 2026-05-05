import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid
} from 'recharts';
import { monthlyHRV, monthlyRHR, weeklyData } from '../data/mockData';
import { useState } from 'react';

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: 10, padding: '8px 12px' }}>
      <p style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ fontSize: 12, color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value}{unit || ''}
        </p>
      ))}
    </div>
  );
};

function StatCard({ label, value, unit, change, color, subLabel }) {
  const up = parseFloat(change) > 0;
  const changeColor = label === 'RHR' ? (up ? '#ef4444' : '#2ef88b') : (up ? '#2ef88b' : '#ef4444');
  return (
    <div className="card" style={{ flex: 1 }}>
      <p style={{ fontSize: 10, color: '#555', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 900, color, marginTop: 6, letterSpacing: '-1px' }}>
        {value}<span style={{ fontSize: 11, color: '#555', marginLeft: 2 }}>{unit}</span>
      </p>
      {change !== undefined && (
        <p style={{ fontSize: 11, color: changeColor, fontWeight: 600, marginTop: 3 }}>
          {up ? '↑' : '↓'} {Math.abs(change)}{unit} 7d avg
        </p>
      )}
      {subLabel && <p style={{ fontSize: 10, color: '#444', marginTop: 2 }}>{subLabel}</p>}
    </div>
  );
}

export default function TrendsView() {
  const [period, setPeriod] = useState('7d');
  const hrvData = period === '30d' ? monthlyHRV : monthlyHRV.slice(-7).map(d => ({ ...d, date: d.date.slice(5) }));
  const rhrData = period === '30d' ? monthlyRHR : monthlyRHR.slice(-7).map(d => ({ ...d, date: d.date.slice(5) }));
  const weekData = weeklyData.map(d => ({ ...d, date: d.date.slice(5) }));

  return (
    <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ padding: '20px 0 8px' }}>
        <p style={{ fontSize: 12, color: '#555', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Analytics</p>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>Trends</h1>
      </div>

      {/* Period toggle */}
      <div style={{ display: 'flex', gap: 6, background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 4 }}>
        {['7d','30d'].map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{
            flex: 1, padding: '9px 0', borderRadius: 9, fontSize: 13, fontWeight: 700,
            background: period === p ? '#2ef88b' : 'transparent',
            color: period === p ? '#000' : '#666',
            transition: 'all 0.2s',
          }}>{p === '7d' ? '7 Days' : '30 Days'}</button>
        ))}
      </div>

      {/* Stat row */}
      <div style={{ display: 'flex', gap: 10 }} className="animate-fade-up">
        <StatCard label="Avg HRV" value={62} unit="ms" change={+8} color="#2ef88b" />
        <StatCard label="Avg RHR" value={52} unit="bpm" change={-2} color="#ef4444" />
        <StatCard label="Avg Recovery" value={72} unit="%" change={+5} color="#f5a623" />
      </div>

      {/* HRV chart */}
      <div className="card animate-fade-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ fontWeight: 700, fontSize: 15 }}>HRV</p>
          <span style={{ fontSize: 12, color: '#2ef88b', fontWeight: 700 }}>62 ms</span>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={hrvData} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="hrvGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2ef88b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2ef88b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#555' }} axisLine={false} tickLine={false}
              interval={period === '30d' ? 6 : 0} />
            <YAxis domain={[20, 100]} tick={{ fontSize: 9, fill: '#555' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip unit="ms" />} cursor={{ stroke: '#ffffff15' }} />
            <ReferenceLine y={58} stroke="#2ef88b" strokeDasharray="4 4" opacity={0.4} label={{ value: 'baseline', fill: '#2ef88b55', fontSize: 9 }} />
            <Area type="monotone" dataKey="hrv" stroke="#2ef88b" strokeWidth={2} fill="url(#hrvGrad)" name="HRV" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* RHR chart */}
      <div className="card animate-fade-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ fontWeight: 700, fontSize: 15 }}>Resting Heart Rate</p>
          <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 700 }}>52 bpm</span>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={rhrData} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="rhrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#555' }} axisLine={false} tickLine={false}
              interval={period === '30d' ? 6 : 0} />
            <YAxis domain={[45, 65]} tick={{ fontSize: 9, fill: '#555' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip unit=" bpm" />} cursor={{ stroke: '#ffffff15' }} />
            <ReferenceLine y={53} stroke="#ef4444" strokeDasharray="4 4" opacity={0.4} />
            <Area type="monotone" dataKey="rhr" stroke="#ef4444" strokeWidth={2} fill="url(#rhrGrad)" name="RHR" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recovery chart */}
      <div className="card animate-fade-up">
        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Recovery Score</p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={weekData} barSize={26} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip unit="%" />} cursor={{ fill: '#ffffff06' }} />
            <ReferenceLine y={67} stroke="#2ef88b" strokeDasharray="3 3" opacity={0.4} />
            <Bar dataKey="recovery" radius={[6,6,0,0]} name="Recovery"
              fill="#2ef88b" opacity={0.75} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8 }}>
          <span style={{ fontSize: 10, color: '#2ef88b55' }}>— Green threshold (67%)</span>
        </div>
      </div>

      {/* Sleep + Strain combo */}
      <div className="card animate-fade-up">
        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Sleep vs Strain</p>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={weekData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="sleep" domain={[50, 100]} tick={{ fontSize: 9, fill: '#555' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="strain" orientation="right" domain={[0, 21]} tick={{ fontSize: 9, fill: '#555' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff15' }} />
            <Line yAxisId="sleep" type="monotone" dataKey="sleep" stroke="#a78bfa" strokeWidth={2} dot={{ r: 3, fill: '#a78bfa' }} name="Sleep %" />
            <Line yAxisId="strain" type="monotone" dataKey="strain" stroke="#f5a623" strokeWidth={2} dot={{ r: 3, fill: '#f5a623' }} name="Strain" />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
          <span style={{ fontSize: 11, color: '#a78bfa' }}>● Sleep score</span>
          <span style={{ fontSize: 11, color: '#f5a623' }}>● Strain</span>
        </div>
      </div>
    </div>
  );
}
