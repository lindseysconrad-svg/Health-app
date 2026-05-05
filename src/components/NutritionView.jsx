import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ProgressBar from './ProgressBar';
import { todayStats, weeklyData } from '../data/mockData';

const { nutrition } = todayStats;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: 10, padding: '8px 12px' }}>
      <p style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 12, color: '#2ef88b', fontWeight: 600 }}>Calories: {payload[0]?.value}</p>
    </div>
  );
};

export default function NutritionView() {
  const [newItem, setNewItem] = useState('');
  const [meals, setMeals] = useState(nutrition.meals);
  const [water, setWater] = useState(nutrition.water.consumed);
  const calWeek = weeklyData.map(d => ({ date: d.date.slice(5), calories: d.calories }));

  function addWater(amount) {
    setWater(prev => Math.min(+(prev + amount).toFixed(1), 10));
  }

  return (
    <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ padding: '20px 0 8px' }}>
        <p style={{ fontSize: 12, color: '#555', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Today</p>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>Nutrition</h1>
      </div>

      {/* Calorie ring area */}
      <div className="card animate-fade-up" style={{ padding: '24px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, color: '#555', fontWeight: 600, letterSpacing: '0.5px' }}>CALORIES</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
              <span style={{ fontSize: 40, fontWeight: 900, color: '#2ef88b', letterSpacing: '-2px' }}>{nutrition.calories.consumed.toLocaleString()}</span>
              <span style={{ fontSize: 14, color: '#555' }}>/ {nutrition.calories.goal.toLocaleString()} kcal</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 11, color: '#555', fontWeight: 600 }}>REMAINING</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#f0f0f0', marginTop: 4 }}>
              {(nutrition.calories.goal - nutrition.calories.consumed).toLocaleString()}
            </p>
          </div>
        </div>
        <ProgressBar value={nutrition.calories.consumed} max={nutrition.calories.goal} color="#2ef88b" height={10} />

        {/* Macros */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 16 }}>
          {[
            { label: 'Protein', val: nutrition.protein.consumed, goal: nutrition.protein.goal, color: '#60a5fa' },
            { label: 'Carbs',   val: nutrition.carbs.consumed,   goal: nutrition.carbs.goal,   color: '#f5a623' },
            { label: 'Fat',     val: nutrition.fat.consumed,     goal: nutrition.fat.goal,     color: '#a78bfa' },
          ].map(m => (
            <div key={m.label} className="card2">
              <p style={{ fontSize: 10, color: '#555', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase' }}>{m.label}</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: m.color, marginTop: 4 }}>{m.val}g</p>
              <p style={{ fontSize: 10, color: '#444', marginBottom: 6 }}>of {m.goal}g</p>
              <ProgressBar value={m.val} max={m.goal} color={m.color} height={4} />
            </div>
          ))}
        </div>
      </div>

      {/* Water tracker */}
      <div className="card animate-fade-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 18 }}>💧</span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Hydration</span>
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#60a5fa' }}>{water}L / {nutrition.water.goal}L</span>
        </div>
        <ProgressBar value={water} max={nutrition.water.goal} color="#60a5fa" height={10} />
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          {[0.25, 0.5, 1.0].map(amt => (
            <button key={amt} onClick={() => addWater(amt)} style={{
              flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 700,
              background: '#60a5fa15', color: '#60a5fa',
              border: '1px solid #60a5fa30',
              transition: 'background 0.15s',
            }}>+{amt}L</button>
          ))}
        </div>
      </div>

      {/* Meals */}
      <div className="card animate-fade-up">
        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Meals</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {meals.map(meal => (
            <div key={meal.id} className="card2">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>{meal.name}</p>
                  <p style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{meal.time}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: '#2ef88b' }}>{meal.calories} kcal</p>
                  <p style={{ fontSize: 11, color: '#555' }}>{meal.protein}g protein</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {meal.items.map((item, i) => (
                  <span key={i} style={{
                    background: '#222', border: '1px solid #2a2a2a',
                    borderRadius: 6, padding: '3px 8px', fontSize: 11, color: '#888',
                  }}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Add meal input */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <input
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            placeholder="Add a meal or food..."
            style={{
              flex: 1, background: '#181818', border: '1px solid #2a2a2a',
              borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#f0f0f0',
              outline: 'none', fontFamily: 'inherit',
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && newItem.trim()) {
                setMeals(prev => [...prev, {
                  id: Date.now(), name: 'Custom', time: new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}),
                  items: [newItem.trim()], calories: 0, protein: 0,
                }]);
                setNewItem('');
              }
            }}
          />
          <button style={{
            padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700,
            background: '#2ef88b20', color: '#2ef88b', border: '1px solid #2ef88b30',
          }}
          onClick={() => {
            if (!newItem.trim()) return;
            setMeals(prev => [...prev, {
              id: Date.now(), name: 'Custom', time: new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}),
              items: [newItem.trim()], calories: 0, protein: 0,
            }]);
            setNewItem('');
          }}>Add</button>
        </div>
      </div>

      {/* Weekly calories */}
      <div className="card animate-fade-up">
        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Weekly Calories</p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={calWeek} barSize={24} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff06' }} />
            <Bar dataKey="calories" fill="#2ef88b" radius={[6,6,0,0]} opacity={0.7} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
