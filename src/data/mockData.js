// ─── WHOOP-depth health data ─────────────────────────────────────────────────

const today = new Date();
const fmt = (d) => d.toISOString().split('T')[0];
function daysAgo(n) {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return fmt(d);
}

// ─── Today ───────────────────────────────────────────────────────────────────
export const todayStats = {
  date: fmt(today),

  // ── Recovery ──────────────────────────────────────────────────────────────
  recovery: {
    score: 78,
    status: 'green',           // green ≥67 | yellow ≥34 | red <34
    hrv: 62,                   // ms — last-night value
    hrv7dAvg: 55,              // 7-day rolling avg
    hrv30dAvg: 58,             // 30-day baseline
    hrv30dHigh: 89,            // personal best
    rhr: 52,                   // bpm — during sleep
    rhr7dAvg: 54,
    rhr30dAvg: 53,
    respiratoryRate: 14.2,     // breaths/min
    respRate30dAvg: 14.5,
    spo2: 98,
    skinTemp: 0.3,             // deviation from 30-day baseline °F
    // contributor breakdown (weights: hrv ~62%, rhr ~26%, sleep ~12%)
    contributors: {
      hrv:   { score: 82, vsBaseline: +8,  weight: 0.62, color: '#2ef88b' },
      rhr:   { score: 76, vsBaseline: -2,  weight: 0.26, color: '#60a5fa' },
      sleep: { score: 68, vsBaseline: -5,  weight: 0.12, color: '#a78bfa' },
    },
  },

  // ── Sleep ─────────────────────────────────────────────────────────────────
  sleep: {
    score: 83,
    duration: 7.4,
    need: 8.0,               // tonight's need (based on debt + strain)
    debt: 2.1,               // rolling 5-night debt
    startTime: '10:45 PM',
    endTime:   '6:10 AM',
    efficiency: 91,
    timeInBed: 8.1,
    stages: { slow_wave: 1.8, rem: 1.6, light: 3.1, awake: 0.9 },
    disturbances: 4,
    hrDuringSleep: 51,
    respiratoryRate: 14.2,
    consistency: 82,         // bedtime consistency score 0-100
    cyclesComplete: 4,
    // Minute-by-minute stage sequence for hypnogram
    hypnogram: [
      { stage: 'light',     minutes: 18 },
      { stage: 'slow_wave', minutes: 44 },
      { stage: 'light',     minutes: 14 },
      { stage: 'rem',       minutes: 24 },
      { stage: 'light',     minutes: 18 },
      { stage: 'slow_wave', minutes: 38 },
      { stage: 'light',     minutes: 10 },
      { stage: 'awake',     minutes: 5  },
      { stage: 'rem',       minutes: 36 },
      { stage: 'light',     minutes: 18 },
      { stage: 'slow_wave', minutes: 28 },
      { stage: 'rem',       minutes: 40 },
      { stage: 'light',     minutes: 22 },
      { stage: 'awake',     minutes: 6  },
      { stage: 'rem',       minutes: 46 },
      { stage: 'light',     minutes: 20 },
      { stage: 'awake',     minutes: 5  },
      { stage: 'light',     minutes: 22 },
      { stage: 'awake',     minutes: 30 },
    ],
  },

  // ── Strain ────────────────────────────────────────────────────────────────
  strain: {
    score: 11.2,
    calories:    2847,
    activeCalories: 612,
    avgHr:  78,
    maxHr: 162,
    maxHrPct: 85,            // % of estimated max HR (162/190)
    estimatedMaxHr: 190,
    vo2max: 52.4,            // ml/kg/min estimated from HRV/RHR
    // Strain coach — based on 78% recovery
    coach: {
      low:  13, high: 18,
      label: 'Optimal training day',
      description: 'Your body is primed. Push hard today — aim for 13–18 strain.',
      color: '#2ef88b',
    },
    activities: [
      {
        id: 1, name: 'Running', icon: '🏃',
        time: '7:00 AM', duration: 42,
        strain: 14.1, avgHr: 148, maxHr: 162,
        maxHrPct: 85, avgHrPct: 78,
        calories: 487, distance: 5.2, pace: "8'04\"",
        zones: { z1: 5, z2: 12, z3: 18, z4: 7, z5: 0 },
        zonePcts: { z1: 12, z2: 29, z3: 43, z4: 17, z5: 0 },
      },
      {
        id: 2, name: 'Walking', icon: '🚶',
        time: '12:30 PM', duration: 25,
        strain: 4.2, avgHr: 92, maxHr: 110,
        maxHrPct: 58, avgHrPct: 48,
        calories: 138, distance: 1.8, pace: null,
        zones: { z1: 15, z2: 8, z3: 2, z4: 0, z5: 0 },
        zonePcts: { z1: 60, z2: 32, z3: 8, z4: 0, z5: 0 },
      },
    ],
  },

  // ── Nutrition ─────────────────────────────────────────────────────────────
  nutrition: {
    calories: { consumed: 2210, goal: 2500 },
    protein:  { consumed: 168,  goal: 200  },
    carbs:    { consumed: 220,  goal: 250  },
    fat:      { consumed: 74,   goal: 80   },
    water:    { consumed: 2.4,  goal: 3.5  },
    meals: [
      { id: 1, name: 'Breakfast',   time: '7:45 AM',  items: ['Eggs × 3', 'Avocado', 'Greek yogurt', 'Blueberries'],             calories: 580, protein: 42 },
      { id: 2, name: 'Pre-workout', time: '6:30 AM',  items: ['Banana', 'Whey protein shake'],                                   calories: 280, protein: 30 },
      { id: 3, name: 'Lunch',       time: '12:00 PM', items: ['Grilled chicken breast', 'Brown rice', 'Broccoli', 'Olive oil'],   calories: 640, protein: 55 },
      { id: 4, name: 'Snack',       time: '3:30 PM',  items: ['Almonds', 'Apple', 'String cheese'],                              calories: 310, protein: 16 },
      { id: 5, name: 'Dinner',      time: '7:00 PM',  items: ['Salmon 6oz', 'Sweet potato', 'Asparagus', 'Lemon butter'],        calories: 400, protein: 25 },
    ],
  },

  // ── WHOOP Behaviors (today's journal pre-fill) ────────────────────────────
  behaviors: {
    alcohol:        0,      // 0 | 1 | 2 | 3 (drinks: none/1-2/3-4/5+)
    caffeineAfterNoon: false,
    lateMeal:       false,
    screenBeforeBed: true,
    stressLevel:    2,      // 1-4: low/moderate/high/very high
    meditation:     true,
    sleepAid:       false,
    sick:           false,
    nicotine:       false,
    preworkout:     true,
    cold:           true,   // cold plunge today
    sauna:          false,
  },

  // ── Peptides ──────────────────────────────────────────────────────────────
  peptides: [
    { id: 1, name: 'BPC-157',   dose: '250 mcg', timing: 'Morning',    route: 'SubQ',  logged: true,  notes: 'Gut/tendon repair',     color: '#2ef88b' },
    { id: 2, name: 'TB-500',    dose: '2.5 mg',  timing: 'Morning',    route: 'SubQ',  logged: true,  notes: 'Recovery & flexibility', color: '#60a5fa' },
    { id: 3, name: 'Sermorelin',dose: '300 mcg', timing: 'Before bed', route: 'SubQ',  logged: false, notes: 'GH release, sleep',      color: '#a78bfa' },
    { id: 4, name: 'PT-141',    dose: '1 mg',    timing: 'As needed',  route: 'Nasal', logged: false, notes: 'Libido',                 color: '#f5a623' },
  ],
  supplements: [
    { id: 1, name: 'Creatine',            dose: '5g',      timing: 'Post-workout', logged: true  },
    { id: 2, name: 'Magnesium Glycinate', dose: '400mg',   timing: 'Before bed',  logged: false },
    { id: 3, name: 'Vitamin D3',          dose: '5000 IU', timing: 'Morning',     logged: true  },
    { id: 4, name: 'Omega-3',             dose: '2g',      timing: 'With meal',   logged: true  },
    { id: 5, name: 'NMN',                 dose: '500mg',   timing: 'Morning',     logged: true  },
    { id: 6, name: 'Ashwagandha',         dose: '600mg',   timing: 'Night',       logged: false },
  ],
};

// ─── 7-day weekly summary ────────────────────────────────────────────────────
export const weeklyData = [
  { date: daysAgo(6), recovery: 55, strain: 14.8, sleep: 72, hrv: 44, rhr: 57, calories: 2800, sleepDur: 6.2 },
  { date: daysAgo(5), recovery: 68, strain: 9.2,  sleep: 80, hrv: 55, rhr: 54, calories: 2400, sleepDur: 7.0 },
  { date: daysAgo(4), recovery: 82, strain: 15.4, sleep: 88, hrv: 68, rhr: 51, calories: 3100, sleepDur: 8.1 },
  { date: daysAgo(3), recovery: 44, strain: 17.1, sleep: 65, hrv: 38, rhr: 60, calories: 3300, sleepDur: 5.8 },
  { date: daysAgo(2), recovery: 71, strain: 8.3,  sleep: 84, hrv: 59, rhr: 53, calories: 2200, sleepDur: 7.5 },
  { date: daysAgo(1), recovery: 90, strain: 6.1,  sleep: 91, hrv: 74, rhr: 50, calories: 2100, sleepDur: 8.4 },
  { date: fmt(today), recovery: 78, strain: 11.2, sleep: 83, hrv: 62, rhr: 52, calories: 2847, sleepDur: 7.4 },
];

// ─── 30-day history ───────────────────────────────────────────────────────────
export const monthlyHRV = Array.from({ length: 30 }, (_, i) => ({
  date: daysAgo(29 - i),
  hrv: Math.round(45 + Math.sin(i * 0.4) * 18 + (i % 3) * 2),
  baseline: 58,
}));

export const monthlyRHR = Array.from({ length: 30 }, (_, i) => ({
  date: daysAgo(29 - i),
  rhr: Math.round(54 + Math.cos(i * 0.3) * 5 + (i % 2)),
  baseline: 53,
}));

// ─── Sleep history ───────────────────────────────────────────────────────────
export const sleepHistory = [
  { date: daysAgo(6), duration: 6.2, score: 72, rem: 1.1, sws: 1.4, need: 8.2, debt: 3.8 },
  { date: daysAgo(5), duration: 7.0, score: 80, rem: 1.4, sws: 1.6, need: 8.0, debt: 4.0 },
  { date: daysAgo(4), duration: 8.1, score: 88, rem: 1.9, sws: 2.0, need: 8.1, debt: 3.1 },
  { date: daysAgo(3), duration: 5.8, score: 65, rem: 0.9, sws: 1.1, need: 7.9, debt: 4.2 },
  { date: daysAgo(2), duration: 7.5, score: 84, rem: 1.7, sws: 1.8, need: 8.0, debt: 3.5 },
  { date: daysAgo(1), duration: 8.4, score: 91, rem: 2.1, sws: 2.2, need: 7.8, debt: 2.3 },
  { date: fmt(today),  duration: 7.4, score: 83, rem: 1.6, sws: 1.8, need: 8.0, debt: 2.1 },
];

// 30-day rolling sleep debt
export const sleepDebt30d = Array.from({ length: 30 }, (_, i) => ({
  date: daysAgo(29 - i),
  debt: parseFloat((1.5 + Math.sin(i * 0.35) * 1.8 + (i % 4) * 0.3).toFixed(1)),
  optimal: 0,
}));

// ─── Strain history ──────────────────────────────────────────────────────────
export const strainHistory = [
  { date: daysAgo(6), strain: 14.8, calories: 3200, recovery: 55 },
  { date: daysAgo(5), strain: 9.2,  calories: 2600, recovery: 68 },
  { date: daysAgo(4), strain: 15.4, calories: 3350, recovery: 82 },
  { date: daysAgo(3), strain: 17.1, calories: 3580, recovery: 44 },
  { date: daysAgo(2), strain: 8.3,  calories: 2490, recovery: 71 },
  { date: daysAgo(1), strain: 6.1,  calories: 2210, recovery: 90 },
  { date: fmt(today),  strain: 11.2, calories: 2847, recovery: 78 },
];

// ─── Behavior journal history (30 days) ──────────────────────────────────────
const behaviorBase = [
  // alcohol, caffeineAfterNoon, lateMeal, screen, stress, meditation, sleepAid
  [0,false,false,true, 2,true, false],
  [2,false,true, true, 3,false,false],
  [0,false,false,false,1,true, false],
  [0,true, false,true, 2,false,false],
  [1,false,false,true, 2,true, false],
  [3,false,true, true, 4,false,true ],
  [0,false,false,false,1,true, false],
  [0,true, false,true, 3,false,false],
  [0,false,false,false,1,true, false],
  [2,false,true, true, 3,false,false],
  [0,false,false,true, 2,true, false],
  [0,false,false,false,1,true, false],
  [1,true, false,true, 2,false,false],
  [0,false,false,false,1,true, false],
  [0,false,true, true, 3,false,false],
  [0,false,false,false,1,true, false],
  [2,false,false,true, 2,false,false],
  [0,false,false,false,2,true, false],
  [0,true, false,true, 2,false,false],
  [0,false,false,false,1,true, false],
  [1,false,true, true, 3,false,false],
  [0,false,false,false,1,true, false],
  [0,false,false,true, 2,true, false],
  [3,false,true, true, 4,false,true ],
  [0,false,false,false,1,true, false],
  [0,true, false,true, 2,false,false],
  [0,false,false,false,2,true, false],
  [0,false,false,false,1,true, false],
  [0,false,false,true, 2,true, false],
  [0,false,false,true, 2,false,false],
];
const recoveries30 = [55,48,72,65,68,42,82,77,80,52,71,84,78,88,63,90,74,82,69,86,58,78,83,45,79,71,85,80,75,78];

export const journalHistory = behaviorBase.map(([alcohol, caffeine, lateMeal, screen, stress, meditation, sleepAid], i) => ({
  date: daysAgo(29 - i),
  recovery: recoveries30[i],
  alcohol, caffeineAfterNoon: caffeine, lateMeal, screenBeforeBed: screen,
  stressLevel: stress, meditation, sleepAid,
}));

// ─── Behavior impact correlations ────────────────────────────────────────────
export const behaviorCorrelations = [
  { behavior: 'Alcohol (1-2 drinks)', icon: '🍺', avgRecovery: 61, baseRecovery: 75, impact: -14, sampleSize: 8,  color: '#ef4444' },
  { behavior: 'Alcohol (3+ drinks)',  icon: '🍻', avgRecovery: 48, baseRecovery: 75, impact: -27, sampleSize: 4,  color: '#ef4444' },
  { behavior: 'Caffeine after noon',  icon: '☕', avgRecovery: 64, baseRecovery: 75, impact: -11, sampleSize: 7,  color: '#f5a623' },
  { behavior: 'Late meal (<2h bed)',  icon: '🌙', avgRecovery: 66, baseRecovery: 75, impact: -9,  sampleSize: 6,  color: '#f5a623' },
  { behavior: 'Screen before bed',   icon: '📱', avgRecovery: 70, baseRecovery: 75, impact: -5,  sampleSize: 14, color: '#f5a623' },
  { behavior: 'High stress',         icon: '😰', avgRecovery: 58, baseRecovery: 75, impact: -17, sampleSize: 5,  color: '#ef4444' },
  { behavior: 'Meditation',          icon: '🧘', avgRecovery: 81, baseRecovery: 75, impact: +6,  sampleSize: 15, color: '#2ef88b' },
  { behavior: 'Sauna session',       icon: '🔥', avgRecovery: 83, baseRecovery: 75, impact: +8,  sampleSize: 10, color: '#2ef88b' },
  { behavior: 'Cold plunge',         icon: '🧊', avgRecovery: 80, baseRecovery: 75, impact: +5,  sampleSize: 9,  color: '#2ef88b' },
  { behavior: 'Consistent bedtime',  icon: '😴', avgRecovery: 82, baseRecovery: 75, impact: +7,  sampleSize: 18, color: '#2ef88b' },
];

// ─── Therapy ─────────────────────────────────────────────────────────────────
export const therapyDefaults = {
  coldPlunge: { tempF: 50, durationMin: 3 },
  sauna:      { tempF: 185, durationMin: 20 },
};

export const therapyHistory = [
  { date: daysAgo(6), coldPlunge: [{ tempF: 48, durationMin: 3, time: '7:30 AM', feeling: 4 }],                    sauna: [{ tempF: 190, durationMin: 20, time: '6:00 PM', rounds: 2, feeling: 5 }] },
  { date: daysAgo(5), coldPlunge: [],                                                                               sauna: [{ tempF: 185, durationMin: 15, time: '7:00 PM', rounds: 1, feeling: 4 }] },
  { date: daysAgo(4), coldPlunge: [{ tempF: 52, durationMin: 5, time: '8:00 AM', feeling: 5 }],                    sauna: [{ tempF: 195, durationMin: 25, time: '5:30 PM', rounds: 3, feeling: 5 }] },
  { date: daysAgo(3), coldPlunge: [{ tempF: 50, durationMin: 3, time: '7:15 AM', feeling: 3 }],                    sauna: [] },
  { date: daysAgo(2), coldPlunge: [],                                                                               sauna: [{ tempF: 180, durationMin: 20, time: '6:30 PM', rounds: 2, feeling: 4 }] },
  { date: daysAgo(1), coldPlunge: [{ tempF: 46, durationMin: 4, time: '7:00 AM', feeling: 5 }],                    sauna: [{ tempF: 190, durationMin: 20, time: '6:00 PM', rounds: 2, feeling: 5 }] },
  { date: fmt(today), coldPlunge: [{ tempF: 50, durationMin: 3, time: '7:30 AM', feeling: 4 }],                    sauna: [] },
];

// ─── Peptide log ─────────────────────────────────────────────────────────────
export const peptideLog = [
  { date: daysAgo(1), name: 'BPC-157',    dose: '250 mcg', route: 'SubQ', logged: true },
  { date: daysAgo(1), name: 'TB-500',     dose: '2.5 mg',  route: 'SubQ', logged: true },
  { date: daysAgo(1), name: 'Sermorelin', dose: '300 mcg', route: 'SubQ', logged: true },
  { date: daysAgo(2), name: 'BPC-157',    dose: '250 mcg', route: 'SubQ', logged: true },
  { date: daysAgo(2), name: 'TB-500',     dose: '2.5 mg',  route: 'SubQ', logged: true },
];

// ─── Personal bests ───────────────────────────────────────────────────────────
export const personalBests = {
  hrv:           89,
  rhr:           45,
  recovery:      96,
  sleepDuration: 9.2,
  sleepScore:    97,
  maxStrain:     19.8,
  vo2max:        54.2,
};

// ─── Weekly perf summary ──────────────────────────────────────────────────────
export const weekSummary = {
  avgRecovery:  71,
  avgStrain:    11.6,
  avgSleepDur:  7.2,
  avgHRV:       57,
  totalCalories: 19340,
  trainingLoad:  82,   // Accumulated Strain Index — 0-100
  loadTrend:    '+12', // vs prior week
};
