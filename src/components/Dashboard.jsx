import RecoveryRing from './RecoveryRing';
import ProgressBar from './ProgressBar';
import { todayStats, therapyHistory, weekSummary } from '../data/mockData';
import { useWhoop } from '../context/WhoopContext';

export default function Dashboard() {
  const { liveData, disconnect } = useWhoop();

  // Merge live WHOOP data over mock data — WHOOP wins on fields it provides
  const recovery = liveData?.recovery
    ? { ...todayStats.recovery, ...liveData.recovery }
    : todayStats.recovery;
  const sleep = liveData?.sleep
    ? { ...todayStats.sleep, ...liveData.sleep }
    : todayStats.sleep;
  const strainBase = todayStats.strain;
  const activities = liveData?.workouts?.length ? liveData.workouts : strainBase.activities;
  const dayStrain  = liveData?.cycles?.[0]?.strain ?? strainBase.score;
  const strain = { ...strainBase, score: dayStrain, activities };
  const { nutrition } = todayStats;
  const sc = strain.score;
  const strainColor = sc >= 14 ? '#ef4444' : sc >= 10 ? '#f5a623' : '#60a5fa';
  const todayTherapy = therapyHistory.at(-1);
  const coldMin  = todayTherapy.coldPlunge.reduce((s, x) => s + x.durationMin, 0);
  const saunaMin = todayTherapy.sauna.reduce((s, x) => s + x.durationMin, 0);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Header */}
      <div style={{ padding: '20px 0 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: 11, color: '#555', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f0f0f0', marginTop: 2 }}>{greeting}</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {liveData && (
            <span style={{ fontSize: 10, fontWeight: 700, color: '#2ef88b', background: '#2ef88b18', border: '1px solid #2ef88b30', padding: '3px 8px', borderRadius: 6 }}>
              ● LIVE
            </span>
          )}
          <button onClick={disconnect} style={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: 10, padding: '6px 12px', color: '#555', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
            Disconnect
          </button>
        </div>
      </div>

      {/* ── Recovery Ring + Contributors ─────────────────────────────────── */}
      <div className="card animate-fade-up" style={{ textAlign: 'center', padding: '24px 20px 20px' }}>
        <RecoveryRing score={recovery.score} size={180} strokeWidth={13} />

        {/* HRV / RHR / SpO2 */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 18 }}>
          {[
            { label: 'HRV',  val: recovery.hrv,  unit: 'ms',  color: '#2ef88b',
              sub: `${recovery.hrv > recovery.hrv30dAvg ? '+' : ''}${recovery.hrv - recovery.hrv30dAvg}ms vs baseline` },
            { label: 'RHR',  val: recovery.rhr,  unit: 'bpm', color: '#f0f0f0',
              sub: `${recovery.rhr < recovery.rhr30dAvg ? '↓' : '↑'}${Math.abs(recovery.rhr - recovery.rhr30dAvg)} vs avg` },
            { label: 'SpO₂', val: recovery.spo2, unit: '%',   color: '#f0f0f0', sub: 'Normal' },
          ].map(m => (
            <div key={m.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 10, color: '#555', fontWeight: 600, letterSpacing: '0.5px' }}>{m.label}</p>
              <p style={{ fontSize: 20, fontWeight: 800, color: m.color, marginTop: 3 }}>
                {m.val}<span style={{ fontSize: 10, color: '#555', marginLeft: 2 }}>{m.unit}</span>
              </p>
              <p style={{ fontSize: 9, color: '#444', marginTop: 2 }}>{m.sub}</p>
            </div>
          ))}
        </div>

        {/* Contributor breakdown */}
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p style={{ fontSize: 10, color: '#444', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', textAlign: 'left', marginBottom: 2 }}>
            Recovery Breakdown
          </p>
          {Object.entries(recovery.contributors).map(([key, c]) => {
            const labels = { hrv: 'HRV', rhr: 'Resting HR', sleep: 'Sleep performance' };
            return (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.color, display: 'inline-block' }} />
                    <span style={{ fontSize: 12, color: '#888' }}>{labels[key]}</span>
                    <span style={{ fontSize: 10, color: '#555', marginLeft: 2 }}>({Math.round(c.weight * 100)}%)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, color: c.vsBaseline >= 0 ? '#2ef88b' : '#ef4444', fontWeight: 700 }}>
                      {c.vsBaseline >= 0 ? '+' : ''}{c.vsBaseline} vs baseline
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: c.color }}>{c.score}%</span>
                  </div>
                </div>
                <ProgressBar value={c.score} max={100} color={c.color} height={5} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Strain Coach ─────────────────────────────────────────────────── */}
      <div className="card animate-fade-up" style={{ borderColor: `${strain.coach.color}30`, background: `${strain.coach.color}07` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: 10, color: '#555', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase' }}>Strain Coach</p>
            <p style={{ fontSize: 14, fontWeight: 800, color: strain.coach.color, marginTop: 4 }}>{strain.coach.label}</p>
            <p style={{ fontSize: 12, color: '#777', marginTop: 4, lineHeight: 1.5 }}>{strain.coach.description}</p>
          </div>
          <div style={{ textAlign: 'center', flexShrink: 0, marginLeft: 12 }}>
            <p style={{ fontSize: 10, color: '#555', fontWeight: 600 }}>TARGET</p>
            <p style={{ fontSize: 22, fontWeight: 900, color: strain.coach.color, letterSpacing: '-1px' }}>
              {strain.coach.low}–{strain.coach.high}
            </p>
          </div>
        </div>
        {/* Mini strain scale */}
        <div style={{ marginTop: 12, position: 'relative' }}>
          <div style={{ height: 8, borderRadius: 4, background: 'linear-gradient(90deg, #60a5fa 0%, #2ef88b 33%, #f5a623 66%, #ef4444 100%)', opacity: 0.5 }} />
          {/* current strain marker */}
          <div style={{
            position: 'absolute', top: -3, left: `${(sc / 21) * 100}%`,
            width: 14, height: 14, borderRadius: '50%', background: strainColor,
            border: '2px solid #080808', transform: 'translateX(-50%)',
            boxShadow: `0 0 8px ${strainColor}`,
          }} />
          {/* target range overlay */}
          <div style={{
            position: 'absolute', top: 0,
            left: `${(strain.coach.low / 21) * 100}%`,
            width: `${((strain.coach.high - strain.coach.low) / 21) * 100}%`,
            height: 8, borderRadius: 4,
            border: `2px solid ${strain.coach.color}`,
            background: `${strain.coach.color}20`,
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 9, color: '#444' }}>0 Rest</span>
          <span style={{ fontSize: 9, color: '#444' }}>21 Max</span>
        </div>
      </div>

      {/* ── Sleep + Strain cards ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 12 }} className="animate-fade-up">
        <div className="card" style={{ flex: 1, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
            <span style={{ fontSize: 14 }}>🌙</span>
            <span style={{ fontSize: 10, color: '#666', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Sleep</span>
          </div>
          <p style={{ fontSize: 28, fontWeight: 900, color: '#a78bfa', letterSpacing: '-1px', lineHeight: 1 }}>{sleep.score}<span style={{ fontSize: 12, color: '#666' }}>%</span></p>
          <p style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{sleep.duration}h · {sleep.efficiency}% eff.</p>
          <div style={{ marginTop: 10 }}>
            <ProgressBar value={sleep.duration} max={sleep.need} color="#a78bfa" height={5} />
            <p style={{ fontSize: 9, color: '#444', marginTop: 3 }}>{sleep.duration}h of {sleep.need}h need</p>
          </div>
        </div>
        <div className="card" style={{ flex: 1, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
            <span style={{ fontSize: 14 }}>⚡</span>
            <span style={{ fontSize: 10, color: '#666', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Strain</span>
          </div>
          <p style={{ fontSize: 28, fontWeight: 900, color: strainColor, letterSpacing: '-1px', lineHeight: 1 }}>{sc}<span style={{ fontSize: 12, color: '#666' }}>/21</span></p>
          <p style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{strain.calories.toLocaleString()} cal</p>
          <div style={{ marginTop: 10 }}>
            <ProgressBar value={sc} max={21} color={strainColor} height={5} />
            <p style={{ fontSize: 9, color: '#444', marginTop: 3 }}>Max HR {strain.maxHrPct}% of max</p>
          </div>
        </div>
      </div>

      {/* ── Biometrics ───────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }} className="animate-fade-up">
        {[
          { icon: '💨', label: 'Resp Rate',  val: recovery.respiratoryRate, unit: 'brpm', sub: `${recovery.respRate30dAvg} avg`, color: '#60a5fa' },
          { icon: '🌡️', label: 'Skin Temp',  val: `+${recovery.skinTemp}`, unit: '°F',   sub: 'vs baseline', color: '#f5a623' },
          { icon: '🏃', label: 'VO₂ Max',    val: strain.vo2max, unit: 'ml/kg/min', sub: 'Good fitness',   color: '#2ef88b' },
          { icon: '📉', label: 'Sleep Debt', val: sleep.debt, unit: 'h',    sub: '5-night rolling', color: sleep.debt > 3 ? '#ef4444' : '#f5a623' },
        ].map(m => (
          <div key={m.label} className="card" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
              <span style={{ fontSize: 14 }}>{m.icon}</span>
              <span style={{ fontSize: 10, color: '#555', fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase' }}>{m.label}</span>
            </div>
            <p style={{ fontSize: 22, fontWeight: 900, color: m.color, letterSpacing: '-0.5px', lineHeight: 1 }}>
              {m.val}<span style={{ fontSize: 10, color: '#555', marginLeft: 3 }}>{m.unit}</span>
            </p>
            <p style={{ fontSize: 10, color: '#444', marginTop: 4 }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Nutrition snapshot ────────────────────────────────────────────── */}
      <div className="card animate-fade-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span>🍽️</span><span style={{ fontWeight: 700, fontSize: 15 }}>Nutrition</span></div>
          <span style={{ fontSize: 13, color: '#2ef88b', fontWeight: 600 }}>{nutrition.calories.consumed} / {nutrition.calories.goal} kcal</span>
        </div>
        <ProgressBar value={nutrition.calories.consumed} max={nutrition.calories.goal} color="#2ef88b" height={8} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12 }}>
          {[
            { label: 'Protein', val: nutrition.protein.consumed, goal: nutrition.protein.goal, color: '#60a5fa' },
            { label: 'Carbs',   val: nutrition.carbs.consumed,   goal: nutrition.carbs.goal,   color: '#f5a623' },
            { label: 'Fat',     val: nutrition.fat.consumed,     goal: nutrition.fat.goal,     color: '#a78bfa' },
          ].map(m => (
            <div key={m.label} style={{ background: '#181818', borderRadius: 10, padding: '10px 12px' }}>
              <p style={{ fontSize: 9, color: '#555', fontWeight: 700, letterSpacing: '0.4px', marginBottom: 4 }}>{m.label.toUpperCase()}</p>
              <p style={{ fontSize: 16, fontWeight: 800, color: m.color }}>{m.val}<span style={{ fontSize: 9, color: '#555', marginLeft: 2 }}>g</span></p>
              <ProgressBar value={m.val} max={m.goal} color={m.color} height={3} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: '#888' }}>💧 Water</span>
            <span style={{ fontSize: 12, color: '#60a5fa', fontWeight: 600 }}>{nutrition.water.consumed}L / {nutrition.water.goal}L</span>
          </div>
          <ProgressBar value={nutrition.water.consumed} max={nutrition.water.goal} color="#60a5fa" height={6} />
        </div>
      </div>

      {/* ── Activities ───────────────────────────────────────────────────── */}
      <div className="card animate-fade-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span>⚡</span><span style={{ fontWeight: 700, fontSize: 15 }}>Activities</span></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {strain.activities.map(act => (
            <div key={act.id} className="card2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>{act.icon}</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>{act.name}</p>
                  <p style={{ fontSize: 10, color: '#555' }}>{act.time} · {act.duration}min · {act.avgHrPct}% avg HR</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 16, fontWeight: 800, color: strainColor }}>{act.strain}</p>
                <p style={{ fontSize: 10, color: '#555' }}>{act.calories} cal</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Thermal Therapy snapshot ─────────────────────────────────────── */}
      <div className="card animate-fade-up" style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span>🌡️</span><span style={{ fontWeight: 700, fontSize: 15 }}>Thermal Therapy</span></div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, padding: '12px', borderRadius: 12, background: '#60a5fa10', border: '1px solid #60a5fa25', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 22 }}>🧊</span>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#60a5fa' }}>{coldMin > 0 ? `${coldMin} min` : '—'}</p>
            <p style={{ fontSize: 9, color: '#4a7fa0', fontWeight: 700, letterSpacing: '0.4px' }}>COLD PLUNGE</p>
          </div>
          <div style={{ flex: 1, padding: '12px', borderRadius: 12, background: '#f9731610', border: '1px solid #f9731625', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 22 }}>🔥</span>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#f97316' }}>{saunaMin > 0 ? `${saunaMin} min` : '—'}</p>
            <p style={{ fontSize: 9, color: '#9d6040', fontWeight: 700, letterSpacing: '0.4px' }}>SAUNA</p>
          </div>
        </div>
      </div>

      {/* ── Week Summary ─────────────────────────────────────────────────── */}
      <div className="card animate-fade-up">
        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Week Summary</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { label: 'Avg Recovery', val: `${weekSummary.avgRecovery}%`, color: '#2ef88b' },
            { label: 'Avg Strain',   val: weekSummary.avgStrain,         color: '#f5a623' },
            { label: 'Avg Sleep',    val: `${weekSummary.avgSleepDur}h`, color: '#a78bfa' },
            { label: 'Avg HRV',      val: `${weekSummary.avgHRV}ms`,     color: '#2ef88b' },
            { label: 'Training Load',val: weekSummary.trainingLoad,      color: '#60a5fa' },
            { label: 'Calories',     val: `${(weekSummary.totalCalories/1000).toFixed(1)}k`, color: '#f0f0f0' },
          ].map(m => (
            <div key={m.label} style={{ background: '#181818', borderRadius: 10, padding: '10px 12px' }}>
              <p style={{ fontSize: 9, color: '#555', fontWeight: 700, letterSpacing: '0.4px', marginBottom: 4 }}>{m.label.toUpperCase()}</p>
              <p style={{ fontSize: 16, fontWeight: 800, color: m.color }}>{m.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Peptides snapshot ─────────────────────────────────────────────── */}
      <div className="card animate-fade-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span>💉</span><span style={{ fontWeight: 700, fontSize: 15 }}>Peptides</span></div>
          <span style={{ fontSize: 11, color: '#555' }}>{todayStats.peptides.filter(p => p.logged).length}/{todayStats.peptides.length} logged</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {todayStats.peptides.map(p => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px', borderRadius: 10,
              background: p.logged ? `${p.color}10` : '#181818',
              border: `1px solid ${p.logged ? p.color + '30' : '#1e1e1e'}`,
            }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: 13, color: p.logged ? p.color : '#888' }}>{p.name}</p>
                <p style={{ fontSize: 10, color: '#555' }}>{p.dose} · {p.timing} · {p.route}</p>
              </div>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: p.logged ? p.color : '#1e1e1e', border: `1px solid ${p.logged ? p.color : '#333'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#000' }}>
                {p.logged ? '✓' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
