import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { sleepHistory, todayStats } from '../data/mockData';

const { sleep } = todayStats;

const stageColors = {
  slow_wave: '#2ef88b',
  rem: '#a78bfa',
  light: '#60a5fa',
  awake: '#ef4444',
};

const stageLabels = {
  slow_wave: 'SWS',
  rem: 'REM',
  light: 'Light',
  awake: 'Awake',
};

function StageDot({ color }) {
  return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: color, marginRight: 5 }} />;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: 10, padding: '8px 12px' }}>
      <p style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ fontSize: 12, color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value}h
        </p>
      ))}
    </div>
  );
};

export default function SleepView() {
  const chartData = sleepHistory.map(d => ({
    date: d.date.slice(5),
    duration: d.duration,
    score: d.score,
    rem: d.rem,
    sws: d.sws,
  }));

  const totalStageTime = Object.values(sleep.stages).reduce((a, b) => a + b, 0);

  return (
    <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ padding: '20px 0 8px' }}>
        <p style={{ fontSize: 12, color: '#555', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Last Night</p>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>Sleep Analysis</h1>
      </div>

      {/* Score card */}
      <div className="card animate-fade-up" style={{ textAlign: 'center', padding: '28px 24px' }}>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#a78bfa', letterSpacing: '-3px', lineHeight: 1 }}>
          {sleep.score}
        </div>
        <p style={{ fontSize: 12, color: '#666', letterSpacing: '2px', marginTop: 4 }}>SLEEP SCORE</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 20 }}>
          <div>
            <p style={{ fontSize: 11, color: '#555', fontWeight: 600 }}>DURATION</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#f0f0f0' }}>{sleep.duration}h</p>
          </div>
          <div>
            <p style={{ fontSize: 11, color: '#555', fontWeight: 600 }}>IN BED</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#f0f0f0' }}>{sleep.timeInBed}h</p>
          </div>
          <div>
            <p style={{ fontSize: 11, color: '#555', fontWeight: 600 }}>EFFICIENCY</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#a78bfa' }}>{sleep.efficiency}%</p>
          </div>
        </div>
      </div>

      {/* Times */}
      <div className="card animate-fade-up">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 11, color: '#555', fontWeight: 600, letterSpacing: '0.5px' }}>BEDTIME</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: '#f0f0f0', marginTop: 4 }}>{sleep.startTime}</p>
          </div>
          <div style={{ fontSize: 20, color: '#333', display: 'flex', alignItems: 'center' }}>→</div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 11, color: '#555', fontWeight: 600, letterSpacing: '0.5px' }}>WAKE TIME</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: '#f0f0f0', marginTop: 4 }}>{sleep.endTime}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
          {Object.entries(sleep.stages).map(([stage, hrs]) => (
            <div key={stage} style={{
              flex: hrs,
              height: 28,
              background: stageColors[stage],
              borderRadius: 4,
              opacity: 0.85,
            }} title={`${stageLabels[stage]}: ${hrs}h`} />
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 12 }}>
          {Object.entries(sleep.stages).map(([stage, hrs]) => (
            <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <StageDot color={stageColors[stage]} />
              <span style={{ fontSize: 12, color: '#888' }}>{stageLabels[stage]}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#f0f0f0', marginLeft: 2 }}>{hrs}h</span>
              <span style={{ fontSize: 11, color: '#444' }}>({Math.round((hrs / totalStageTime) * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vitals during sleep */}
      <div style={{ display: 'flex', gap: 10 }} className="animate-fade-up">
        <div className="card" style={{ flex: 1, padding: 16 }}>
          <p style={{ fontSize: 11, color: '#555', fontWeight: 600, letterSpacing: '0.5px' }}>HR DURING SLEEP</p>
          <p style={{ fontSize: 26, fontWeight: 800, color: '#ef4444', marginTop: 6 }}>{sleep.hrDuringSleep}<span style={{ fontSize: 12, color: '#666', marginLeft: 2 }}>bpm</span></p>
        </div>
        <div className="card" style={{ flex: 1, padding: 16 }}>
          <p style={{ fontSize: 11, color: '#555', fontWeight: 600, letterSpacing: '0.5px' }}>DISTURBANCES</p>
          <p style={{ fontSize: 26, fontWeight: 800, color: '#f5a623', marginTop: 6 }}>{sleep.disturbances}</p>
        </div>
        <div className="card" style={{ flex: 1, padding: 16 }}>
          <p style={{ fontSize: 11, color: '#555', fontWeight: 600, letterSpacing: '0.5px' }}>SLEEP DEBT</p>
          <p style={{ fontSize: 26, fontWeight: 800, color: '#f0f0f0', marginTop: 6 }}>{sleep.debt}h</p>
        </div>
      </div>

      {/* 7-day Sleep Chart */}
      <div className="card animate-fade-up">
        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>7-Day Sleep Duration</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} barSize={22} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff08' }} />
            <Bar dataKey="sws" stackId="a" fill="#2ef88b" radius={[0,0,0,0]} name="SWS" />
            <Bar dataKey="rem" stackId="a" fill="#a78bfa" radius={[0,0,0,0]} name="REM" />
            <Bar dataKey="duration" stackId="b" fill="#60a5fa" radius={[6,6,0,0]} name="Total" opacity={0.4} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sleep score trend */}
      <div className="card animate-fade-up">
        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Sleep Score Trend</p>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={chartData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
            <YAxis domain={[50, 100]} tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20' }} />
            <Area type="monotone" dataKey="score" stroke="#a78bfa" strokeWidth={2} fill="url(#sleepGrad)" name="Score" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Sleep tips */}
      <div className="card animate-fade-up" style={{ borderColor: '#a78bfa30', background: '#a78bfa08' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#a78bfa', marginBottom: 8 }}>💡 Sleep Insight</p>
        <p style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>
          Your REM sleep ({sleep.stages.rem}h) is slightly below the ideal 1.5–2h target. Consider winding down 30 min earlier and reducing screen exposure before bed.
        </p>
      </div>
    </div>
  );
}
