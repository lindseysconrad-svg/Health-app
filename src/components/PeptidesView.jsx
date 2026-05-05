import { useState } from 'react';
import { todayStats, peptideLog } from '../data/mockData';

const { recovery, sleep } = todayStats;

// AI-generated recommendations based on current metrics
function getRecommendations(recovery, sleep) {
  const recs = [];

  if (recovery.hrv < 50) {
    recs.push({
      name: 'BPC-157',
      priority: 'HIGH',
      reason: 'Your HRV is suppressed. BPC-157 accelerates systemic recovery by promoting angiogenesis and reducing inflammation, which supports HRV normalization.',
      dose: '250–500 mcg/day',
      timing: 'Morning, fasted',
      color: '#2ef88b',
      icon: '🔬',
    });
  }
  if (sleep.score < 80 || sleep.stages.rem < 1.5) {
    recs.push({
      name: 'Sermorelin',
      priority: 'HIGH',
      reason: `REM sleep at ${sleep.stages.rem}h is below optimal. Sermorelin stimulates pulsatile GH release which deepens slow-wave and REM sleep architecture.`,
      dose: '200–500 mcg',
      timing: 'Before bed on empty stomach',
      color: '#a78bfa',
      icon: '🌙',
    });
  }
  if (recovery.hrv < 70) {
    recs.push({
      name: 'TB-500 (Thymosin Beta-4)',
      priority: 'MODERATE',
      reason: 'Supports recovery and cellular repair. Particularly effective for reducing systemic inflammation markers that suppress HRV.',
      dose: '2–5 mg/week',
      timing: 'SubQ 2–3× weekly',
      color: '#60a5fa',
      icon: '🛡️',
    });
  }
  recs.push({
    name: 'CJC-1295 / Ipamorelin',
    priority: 'CONSIDER',
    reason: 'GHRH + GHRP combination for sustained GH pulse. Best for body recomposition, deeper sleep, and fat oxidation — ideal for your goals.',
    dose: 'CJC 100 mcg + Ipa 100–200 mcg',
    timing: 'Before bed',
    color: '#f5a623',
    icon: '⚡',
  });
  if (recovery.rhr > 55) {
    recs.push({
      name: 'Epithalon',
      priority: 'CONSIDER',
      reason: 'Telomere-extending peptide with cardiovascular benefits. May reduce resting heart rate over weeks of use via improved cardiac efficiency.',
      dose: '5–10 mg per cycle',
      timing: 'Daily for 10-day cycle',
      color: '#ec4899',
      icon: '🧬',
    });
  }
  return recs;
}

const priorityColors = {
  HIGH: '#ef4444',
  MODERATE: '#f5a623',
  CONSIDER: '#60a5fa',
};

export default function PeptidesView() {
  const [peptides, setPeptides] = useState(todayStats.peptides);
  const [supplements, setSupplements] = useState(todayStats.supplements);
  const [tab, setTab] = useState('log'); // log | recs | history

  const recs = getRecommendations(recovery, sleep);

  function togglePeptide(id) {
    setPeptides(prev => prev.map(p => p.id === id ? { ...p, logged: !p.logged } : p));
  }
  function toggleSupplement(id) {
    setSupplements(prev => prev.map(s => s.id === id ? { ...s, logged: !s.logged } : s));
  }

  return (
    <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ padding: '20px 0 8px' }}>
        <p style={{ fontSize: 12, color: '#555', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Today</p>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>Peptides & Supps</h1>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 6, background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 4 }}>
        {[['log','📋 Log'],['recs','🤖 AI Recs'],['history','📅 History']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1, padding: '9px 0', borderRadius: 9, fontSize: 12, fontWeight: 700,
            background: tab === key ? '#2ef88b' : 'transparent',
            color: tab === key ? '#000' : '#666',
            transition: 'all 0.2s',
          }}>{label}</button>
        ))}
      </div>

      {tab === 'log' && (
        <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Progress */}
          <div className="card" style={{ textAlign: 'center', padding: '16px 20px' }}>
            <p style={{ fontSize: 11, color: '#555', fontWeight: 600, letterSpacing: '0.5px' }}>TODAY'S ADHERENCE</p>
            <p style={{ fontSize: 40, fontWeight: 900, color: '#2ef88b', marginTop: 6 }}>
              {Math.round(([...peptides, ...supplements].filter(p => p.logged).length / (peptides.length + supplements.length)) * 100)}%
            </p>
            <p style={{ fontSize: 12, color: '#666' }}>
              {[...peptides, ...supplements].filter(p => p.logged).length} of {peptides.length + supplements.length} items logged
            </p>
          </div>

          {/* Peptides */}
          <div className="card">
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>💉 Peptides</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {peptides.map(p => (
                <div key={p.id} onClick={() => togglePeptide(p.id)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
                  background: p.logged ? `${p.color}12` : '#181818',
                  border: `1px solid ${p.logged ? p.color + '35' : '#222'}`,
                  transition: 'all 0.2s',
                }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: p.logged ? p.color : '#f0f0f0' }}>{p.name}</p>
                    <p style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{p.dose} · {p.timing} · {p.route}</p>
                    <p style={{ fontSize: 11, color: '#444', marginTop: 2 }}>{p.notes}</p>
                  </div>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: p.logged ? p.color : '#1e1e1e',
                    border: `2px solid ${p.logged ? p.color : '#333'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: '#000',
                    transition: 'all 0.2s',
                  }}>
                    {p.logged ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supplements */}
          <div className="card">
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>💊 Supplements</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {supplements.map(s => (
                <div key={s.id} onClick={() => toggleSupplement(s.id)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
                  background: s.logged ? '#2ef88b12' : '#181818',
                  border: `1px solid ${s.logged ? '#2ef88b35' : '#222'}`,
                  transition: 'all 0.2s',
                }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: s.logged ? '#2ef88b' : '#f0f0f0' }}>{s.name}</p>
                    <p style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{s.dose} · {s.timing}</p>
                  </div>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: s.logged ? '#2ef88b' : '#1e1e1e',
                    border: `2px solid ${s.logged ? '#2ef88b' : '#333'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: '#000', transition: 'all 0.2s',
                  }}>
                    {s.logged ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'recs' && (
        <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card" style={{ background: '#2ef88b08', borderColor: '#2ef88b20', padding: '14px 16px' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#2ef88b', marginBottom: 6 }}>🤖 AI Coach Analysis</p>
            <p style={{ fontSize: 12, color: '#888', lineHeight: 1.6 }}>
              Based on your current HRV ({recovery.hrv}ms), RHR ({recovery.rhr}bpm), sleep score ({sleep.score}%), and REM sleep ({sleep.stages.rem}h), here are personalized peptide recommendations to optimize your performance.
            </p>
          </div>

          {recs.map((rec, i) => (
            <div key={i} className="card" style={{ borderColor: `${rec.color}25`, background: `${rec.color}06` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{rec.icon}</span>
                  <p style={{ fontWeight: 800, fontSize: 15, color: rec.color }}>{rec.name}</p>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '1px',
                  color: priorityColors[rec.priority],
                  background: `${priorityColors[rec.priority]}15`,
                  border: `1px solid ${priorityColors[rec.priority]}30`,
                  padding: '3px 8px', borderRadius: 6,
                }}>
                  {rec.priority}
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#888', lineHeight: 1.6, marginBottom: 12 }}>{rec.reason}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ background: '#1e1e1e', borderRadius: 8, padding: '5px 10px', fontSize: 11, color: '#666' }}>
                  💊 {rec.dose}
                </span>
                <span style={{ background: '#1e1e1e', borderRadius: 8, padding: '5px 10px', fontSize: 11, color: '#666' }}>
                  ⏰ {rec.timing}
                </span>
              </div>
            </div>
          ))}

          <div className="card" style={{ borderColor: '#ef444430', background: '#ef444408' }}>
            <p style={{ fontSize: 12, color: '#ef4444', fontWeight: 700, marginBottom: 6 }}>⚠️ Disclaimer</p>
            <p style={{ fontSize: 11, color: '#666', lineHeight: 1.6 }}>
              Recommendations are for informational purposes only. Always consult a licensed medical professional before using peptides or any compounds. Do not exceed recommended doses.
            </p>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="card">
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Recent Logs</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {peptideLog.map((entry, i) => (
                <div key={i} className="card2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13, color: '#2ef88b' }}>{entry.name}</p>
                    <p style={{ fontSize: 11, color: '#555' }}>{entry.dose} · {entry.route}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 11, color: '#555' }}>{entry.date}</p>
                    <span style={{ fontSize: 10, background: '#2ef88b15', color: '#2ef88b', padding: '2px 7px', borderRadius: 5, fontWeight: 700 }}>✓ LOGGED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
