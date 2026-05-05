import { useState } from 'react';
import RecoveryRing from './RecoveryRing';
import MetricPill from './MetricPill';
import ProgressBar from './ProgressBar';
import { todayStats, therapyHistory } from '../data/mockData';

export default function Dashboard() {
  const { recovery, sleep, strain, nutrition } = todayStats;
  const strainColor = strain.score >= 14 ? '#ef4444' : strain.score >= 10 ? '#f5a623' : '#60a5fa';
  const todayTherapy = therapyHistory.at(-1);
  const coldToday  = todayTherapy.coldPlunge.reduce((s, x) => s + x.durationMin, 0);
  const saunaToday = todayTherapy.sauna.reduce((s, x) => s + x.durationMin, 0);

  return (
    <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ padding: '20px 0 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: 12, color: '#555', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f0f0f0', marginTop: 2 }}>Good morning</h1>
        </div>
        <div style={{
          width: 42, height: 42, borderRadius: '50%',
          background: 'linear-gradient(135deg, #2ef88b, #60a5fa)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 700, color: '#000',
        }}>W</div>
      </div>

      {/* Recovery Ring */}
      <div className="card animate-fade-up" style={{ textAlign: 'center', padding: '28px 20px' }}>
        <RecoveryRing score={recovery.score} size={190} strokeWidth={14} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: '#555', fontWeight: 600, letterSpacing: '0.5px' }}>HRV</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: '#2ef88b' }}>{recovery.hrv}<span style={{ fontSize: 11, color: '#666', marginLeft: 2 }}>ms</span></p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: '#555', fontWeight: 600, letterSpacing: '0.5px' }}>RHR</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: '#f0f0f0' }}>{recovery.rhr}<span style={{ fontSize: 11, color: '#666', marginLeft: 2 }}>bpm</span></p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: '#555', fontWeight: 600, letterSpacing: '0.5px' }}>SpO₂</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: '#f0f0f0' }}>{recovery.spo2}<span style={{ fontSize: 11, color: '#666', marginLeft: 2 }}>%</span></p>
          </div>
        </div>
      </div>

      {/* Sleep + Strain row */}
      <div style={{ display: 'flex', gap: 12 }} className="animate-fade-up">
        {/* Sleep */}
        <div className="card" style={{ flex: 1, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 15 }}>🌙</span>
            <span style={{ fontSize: 11, color: '#666', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Sleep</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: '#a78bfa', letterSpacing: '-1px' }}>{sleep.score}</span>
            <span style={{ fontSize: 12, color: '#666' }}>%</span>
          </div>
          <p style={{ fontSize: 12, color: '#888' }}>{sleep.duration}h · {sleep.efficiency}% eff.</p>
          <div style={{ marginTop: 10 }}>
            <ProgressBar value={sleep.duration} max={sleep.need} color="#a78bfa" height={5} />
            <p style={{ fontSize: 10, color: '#444', marginTop: 4 }}>{sleep.duration}h of {sleep.need}h need</p>
          </div>
        </div>

        {/* Strain */}
        <div className="card" style={{ flex: 1, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 15 }}>⚡</span>
            <span style={{ fontSize: 11, color: '#666', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Strain</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: strainColor, letterSpacing: '-1px' }}>{strain.score}</span>
            <span style={{ fontSize: 12, color: '#666' }}>/21</span>
          </div>
          <p style={{ fontSize: 12, color: '#888' }}>{strain.calories.toLocaleString()} cal</p>
          <div style={{ marginTop: 10 }}>
            <ProgressBar value={strain.score} max={21} color={strainColor} height={5} />
          </div>
        </div>
      </div>

      {/* Biometrics row */}
      <div style={{ display: 'flex', gap: 10 }} className="animate-fade-up">
        <MetricPill icon="💨" label="Resp Rate" value={recovery.respiratoryRate} unit="brpm" color="#60a5fa" />
        <MetricPill icon="🌡️" label="Skin Temp" value={`+${recovery.skinTemp}`} unit="°F" color="#f5a623" />
      </div>

      {/* Nutrition snapshot */}
      <div className="card animate-fade-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>🍽️</span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Nutrition</span>
          </div>
          <span style={{ fontSize: 13, color: '#2ef88b', fontWeight: 600 }}>
            {nutrition.calories.consumed} / {nutrition.calories.goal} kcal
          </span>
        </div>
        <ProgressBar value={nutrition.calories.consumed} max={nutrition.calories.goal} color="#2ef88b" height={8} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 14 }}>
          {[
            { label: 'Protein', val: nutrition.protein.consumed, goal: nutrition.protein.goal, unit: 'g', color: '#60a5fa' },
            { label: 'Carbs', val: nutrition.carbs.consumed, goal: nutrition.carbs.goal, unit: 'g', color: '#f5a623' },
            { label: 'Fat', val: nutrition.fat.consumed, goal: nutrition.fat.goal, unit: 'g', color: '#a78bfa' },
          ].map(m => (
            <div key={m.label} style={{ background: '#181818', borderRadius: 10, padding: '10px 12px' }}>
              <p style={{ fontSize: 10, color: '#555', fontWeight: 600, letterSpacing: '0.4px', marginBottom: 4 }}>{m.label.toUpperCase()}</p>
              <p style={{ fontSize: 16, fontWeight: 800, color: m.color }}>{m.val}<span style={{ fontSize: 10, color: '#555', marginLeft: 2 }}>{m.unit}</span></p>
              <ProgressBar value={m.val} max={m.goal} color={m.color} height={3} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14 }}>💧</span>
              <span style={{ fontSize: 13, color: '#888' }}>Water</span>
            </div>
            <span style={{ fontSize: 13, color: '#60a5fa', fontWeight: 600 }}>
              {nutrition.water.consumed}L / {nutrition.water.goal}L
            </span>
          </div>
          <ProgressBar value={nutrition.water.consumed} max={nutrition.water.goal} color="#60a5fa" height={6} />
        </div>
      </div>

      {/* Today's Activities */}
      <div className="card animate-fade-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>⚡</span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Activities</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {strain.activities.map(act => (
            <div key={act.id} className="card2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>{act.icon}</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>{act.name}</p>
                  <p style={{ fontSize: 11, color: '#555' }}>{act.time} · {act.duration}min</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 16, fontWeight: 800, color: strainColor }}>{act.strain}</p>
                <p style={{ fontSize: 11, color: '#555' }}>{act.calories} cal</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thermal Therapy snapshot */}
      <div className="card animate-fade-up" style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>🌡️</span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Thermal Therapy</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{
            flex: 1, padding: '12px', borderRadius: 12,
            background: '#60a5fa10', border: '1px solid #60a5fa25',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}>
            <span style={{ fontSize: 22 }}>🧊</span>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#60a5fa' }}>
              {coldToday > 0 ? `${coldToday} min` : '—'}
            </p>
            <p style={{ fontSize: 10, color: '#4a7fa0', fontWeight: 600, letterSpacing: '0.4px' }}>COLD PLUNGE</p>
          </div>
          <div style={{
            flex: 1, padding: '12px', borderRadius: 12,
            background: '#f9731610', border: '1px solid #f9731625',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}>
            <span style={{ fontSize: 22 }}>🔥</span>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#f97316' }}>
              {saunaToday > 0 ? `${saunaToday} min` : '—'}
            </p>
            <p style={{ fontSize: 10, color: '#9d6040', fontWeight: 600, letterSpacing: '0.4px' }}>SAUNA</p>
          </div>
        </div>
      </div>

      {/* Peptides snapshot */}
      <div className="card animate-fade-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>💉</span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Peptides</span>
          </div>
          <span style={{ fontSize: 11, color: '#555' }}>
            {todayStats.peptides.filter(p => p.logged).length}/{todayStats.peptides.length} logged
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {todayStats.peptides.map(p => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px', borderRadius: 10,
              background: p.logged ? `${p.color}10` : '#181818',
              border: `1px solid ${p.logged ? p.color + '30' : '#1e1e1e'}`,
            }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: 13, color: p.logged ? p.color : '#888' }}>{p.name}</p>
                <p style={{ fontSize: 11, color: '#555' }}>{p.dose} · {p.timing} · {p.route}</p>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: p.logged ? p.color : '#1e1e1e',
                border: `1px solid ${p.logged ? p.color : '#333'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12,
              }}>
                {p.logged ? '✓' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
