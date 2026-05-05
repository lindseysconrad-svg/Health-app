import { useState } from 'react';
import ProgressBar from './ProgressBar';
import { weeklyData } from '../data/mockData';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

const MOODS = [
  { emoji: '😫', label: 'Rough', score: 1, color: '#ef4444' },
  { emoji: '😕', label: 'Low', score: 2, color: '#f97316' },
  { emoji: '😐', label: 'Okay', score: 3, color: '#f5a623' },
  { emoji: '🙂', label: 'Good', score: 4, color: '#84cc16' },
  { emoji: '😤', label: 'Dialed', score: 5, color: '#2ef88b' },
];

const FEELINGS = [
  '💪 Strong', '🧠 Sharp', '😴 Tired', '🤒 Sore', '🔥 Motivated',
  '😰 Stressed', '🏆 Crushing it', '🥱 Low energy', '😎 Locked in', '🫀 Heart racing',
];

// Mock weight data
const weightData = [
  { date: '4/29', weight: 183.4 },
  { date: '4/30', weight: 182.8 },
  { date: '5/01', weight: 183.1 },
  { date: '5/02', weight: 182.2 },
  { date: '5/03', weight: 181.9 },
  { date: '5/04', weight: 181.4 },
  { date: '5/05', weight: 181.0 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: 10, padding: '8px 12px' }}>
      <p style={{ fontSize: 11, color: '#888' }}>{label}</p>
      <p style={{ fontSize: 13, color: '#60a5fa', fontWeight: 700 }}>{payload[0]?.value} lbs</p>
    </div>
  );
};

export default function JournalView() {
  const [mood, setMood] = useState(null);
  const [feelings, setFeelings] = useState([]);
  const [note, setNote] = useState('');
  const [weight, setWeight] = useState('');
  const [savedWeight, setSavedWeight] = useState(181.0);
  const [submitted, setSubmitted] = useState(false);
  const [energy, setEnergy] = useState(7);

  const currentMood = MOODS.find(m => m.score === mood);
  const weightChange = savedWeight - weightData[0].weight;
  const weightColor = weightChange < 0 ? '#2ef88b' : weightChange > 0 ? '#ef4444' : '#888';

  function toggleFeeling(f) {
    setFeelings(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  }

  function handleSubmit() {
    if (!mood) return;
    if (weight) setSavedWeight(parseFloat(weight));
    setSubmitted(true);
  }

  return (
    <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ padding: '20px 0 8px' }}>
        <p style={{ fontSize: 12, color: '#555', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Daily Check-in</p>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>How Are You?</h1>
      </div>

      {submitted ? (
        <div className="card animate-scale-in" style={{ textAlign: 'center', padding: '32px 24px', borderColor: '#2ef88b30', background: '#2ef88b08' }}>
          <span style={{ fontSize: 48 }}>{currentMood?.emoji}</span>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#2ef88b', marginTop: 12 }}>Check-in Logged!</p>
          <p style={{ fontSize: 13, color: '#888', marginTop: 6 }}>Your snapshot is saved. Keep crushing it.</p>
          <button onClick={() => setSubmitted(false)} style={{
            marginTop: 18, padding: '10px 24px', borderRadius: 10, fontSize: 13, fontWeight: 700,
            background: '#2ef88b20', color: '#2ef88b', border: '1px solid #2ef88b30',
          }}>Edit Entry</button>
        </div>
      ) : (
        <>
          {/* Mood selector */}
          <div className="card animate-fade-up">
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Overall Mood</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
              {MOODS.map(m => (
                <button key={m.score} onClick={() => setMood(m.score)} style={{
                  flex: 1, padding: '12px 4px', borderRadius: 12,
                  background: mood === m.score ? `${m.color}20` : '#181818',
                  border: `2px solid ${mood === m.score ? m.color : '#1e1e1e'}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                  transition: 'all 0.2s',
                }}>
                  <span style={{ fontSize: 24 }}>{m.emoji}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: mood === m.score ? m.color : '#555', letterSpacing: '0.3px' }}>{m.label.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Energy level slider */}
          <div className="card animate-fade-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <p style={{ fontWeight: 700, fontSize: 15 }}>Energy Level</p>
              <span style={{ fontSize: 18, fontWeight: 900, color: energy >= 7 ? '#2ef88b' : energy >= 4 ? '#f5a623' : '#ef4444' }}>{energy}/10</span>
            </div>
            <input
              type="range" min={1} max={10} value={energy}
              onChange={e => setEnergy(+e.target.value)}
              style={{ width: '100%', accentColor: '#2ef88b', height: 6 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 10, color: '#555' }}>💀 Dead</span>
              <span style={{ fontSize: 10, color: '#555' }}>🔥 Beast mode</span>
            </div>
          </div>

          {/* How do you feel tags */}
          <div className="card animate-fade-up">
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>How do you feel? <span style={{ fontSize: 12, color: '#555', fontWeight: 400 }}>(pick all that apply)</span></p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {FEELINGS.map(f => (
                <button key={f} onClick={() => toggleFeeling(f)} style={{
                  padding: '8px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                  background: feelings.includes(f) ? '#2ef88b20' : '#181818',
                  color: feelings.includes(f) ? '#2ef88b' : '#888',
                  border: `1px solid ${feelings.includes(f) ? '#2ef88b40' : '#222'}`,
                  transition: 'all 0.15s',
                }}>{f}</button>
              ))}
            </div>
          </div>

          {/* Weight */}
          <div className="card animate-fade-up">
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Weight</p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, color: '#555', marginBottom: 4 }}>CURRENT</p>
                <p style={{ fontSize: 32, fontWeight: 900, color: '#60a5fa' }}>{savedWeight}<span style={{ fontSize: 13, color: '#555', marginLeft: 4 }}>lbs</span></p>
                <p style={{ fontSize: 12, color: weightColor, marginTop: 2, fontWeight: 600 }}>
                  {weightChange < 0 ? '↓' : weightChange > 0 ? '↑' : '—'} {Math.abs(weightChange).toFixed(1)} lbs from 7 days ago
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, color: '#555', marginBottom: 6 }}>LOG TODAY</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    placeholder="lbs"
                    type="number"
                    step="0.1"
                    style={{
                      flex: 1, background: '#181818', border: '1px solid #2a2a2a',
                      borderRadius: 10, padding: '10px 12px', fontSize: 14, color: '#f0f0f0',
                      outline: 'none', fontFamily: 'inherit',
                    }}
                  />
                  <button onClick={() => { if (weight) setSavedWeight(parseFloat(weight)); setWeight(''); }} style={{
                    padding: '10px 12px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                    background: '#60a5fa20', color: '#60a5fa', border: '1px solid #60a5fa30',
                  }}>Log</button>
                </div>
              </div>
            </div>
          </div>

          {/* Journal note */}
          <div className="card animate-fade-up">
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Notes / Journal</p>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="How's training going? Anything notable today — sleep quality, soreness, mindset, diet..."
              rows={4}
              style={{
                width: '100%', background: '#181818', border: '1px solid #222',
                borderRadius: 12, padding: '12px 14px', fontSize: 13, color: '#f0f0f0',
                outline: 'none', fontFamily: 'inherit', resize: 'none', lineHeight: 1.6,
              }}
            />
          </div>

          <button onClick={handleSubmit} disabled={!mood} style={{
            padding: '16px', borderRadius: 14, fontSize: 15, fontWeight: 800,
            background: mood ? 'linear-gradient(135deg, #2ef88b, #60a5fa)' : '#1e1e1e',
            color: mood ? '#000' : '#444',
            border: 'none', letterSpacing: '0.5px',
            transition: 'all 0.2s',
            boxShadow: mood ? '0 8px 24px rgba(46,248,139,0.2)' : 'none',
          }}>
            Save Daily Check-in
          </button>
        </>
      )}

      {/* Weight Chart */}
      <div className="card animate-fade-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ fontWeight: 700, fontSize: 15 }}>Weight Trend</p>
          <span style={{ fontSize: 12, color: weightColor, fontWeight: 700 }}>
            {weightChange < 0 ? `↓ ${Math.abs(weightChange).toFixed(1)} lbs` : weightChange > 0 ? `↑ ${weightChange.toFixed(1)} lbs` : 'Stable'} / 7d
          </span>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={weightData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
            <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff15' }} />
            <ReferenceLine y={weightData[0].weight} stroke="#333" strokeDasharray="4 4" />
            <Line
              type="monotone" dataKey="weight" stroke="#60a5fa"
              strokeWidth={2.5} dot={{ fill: '#60a5fa', r: 3 }} activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Snapshot summary */}
      <div className="card animate-fade-up" style={{ borderColor: '#2ef88b20', background: '#2ef88b06' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#2ef88b', marginBottom: 10 }}>📊 Day Snapshot</p>
        {[
          { label: 'Recovery', val: '78%', color: '#2ef88b' },
          { label: 'Sleep Score', val: '83%', color: '#a78bfa' },
          { label: 'Strain', val: '11.2', color: '#f5a623' },
          { label: 'Calories', val: '2,210 / 2,500', color: '#f0f0f0' },
          { label: 'Water', val: '2.4L / 3.5L', color: '#60a5fa' },
          { label: 'Weight', val: `${savedWeight} lbs`, color: '#60a5fa' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #1a1a1a' }}>
            <span style={{ fontSize: 13, color: '#666' }}>{item.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
