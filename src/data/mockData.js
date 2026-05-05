// WHOOP-style health + lifestyle data

const today = new Date();
const fmt = (d) => d.toISOString().split('T')[0];
function daysAgo(n) {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return fmt(d);
}

export const todayStats = {
  date: fmt(today),
  recovery: {
    score: 78,
    status: 'green', // green | yellow | red
    hrv: 62,
    rhr: 52,
    respiratoryRate: 14.2,
    spo2: 98,
    skinTemp: 0.3,
  },
  sleep: {
    score: 83,
    duration: 7.4,
    startTime: '10:45 PM',
    endTime: '6:10 AM',
    efficiency: 91,
    stages: { slow_wave: 1.8, rem: 1.6, light: 3.1, awake: 0.9 },
    disturbances: 4,
    timeInBed: 8.1,
    hrDuringSleep: 51,
    need: 8.0,
    debt: 0.6,
  },
  strain: {
    score: 11.2,
    calories: 2847,
    avgHr: 78,
    maxHr: 162,
    activities: [
      {
        id: 1,
        name: 'Running',
        icon: '🏃',
        time: '7:00 AM',
        duration: 42,
        strain: 14.1,
        avgHr: 148,
        maxHr: 162,
        calories: 487,
        distance: 5.2,
        pace: "8'04\"",
        zones: { z1: 5, z2: 12, z3: 18, z4: 7, z5: 0 },
      },
      {
        id: 2,
        name: 'Walking',
        icon: '🚶',
        time: '12:30 PM',
        duration: 25,
        strain: 4.2,
        avgHr: 92,
        maxHr: 110,
        calories: 138,
        distance: 1.8,
        pace: null,
        zones: { z1: 15, z2: 8, z3: 2, z4: 0, z5: 0 },
      },
    ],
  },
  nutrition: {
    calories: { consumed: 2210, goal: 2500 },
    protein: { consumed: 168, goal: 200 },
    carbs:   { consumed: 220, goal: 250 },
    fat:     { consumed: 74, goal: 80 },
    water:   { consumed: 2.4, goal: 3.5 },
    meals: [
      {
        id: 1,
        name: 'Breakfast',
        time: '7:45 AM',
        items: ['Eggs × 3', 'Avocado', 'Greek yogurt', 'Blueberries'],
        calories: 580,
        protein: 42,
      },
      {
        id: 2,
        name: 'Pre-workout',
        time: '6:30 AM',
        items: ['Banana', 'Whey protein shake'],
        calories: 280,
        protein: 30,
      },
      {
        id: 3,
        name: 'Lunch',
        time: '12:00 PM',
        items: ['Grilled chicken breast', 'Brown rice', 'Broccoli', 'Olive oil'],
        calories: 640,
        protein: 55,
      },
      {
        id: 4,
        name: 'Snack',
        time: '3:30 PM',
        items: ['Almonds', 'Apple', 'String cheese'],
        calories: 310,
        protein: 16,
      },
      {
        id: 5,
        name: 'Dinner',
        time: '7:00 PM',
        items: ['Salmon 6oz', 'Sweet potato', 'Asparagus', 'Lemon butter'],
        calories: 400,
        protein: 25,
      },
    ],
  },
  peptides: [
    {
      id: 1,
      name: 'BPC-157',
      dose: '250 mcg',
      timing: 'Morning',
      route: 'SubQ',
      logged: true,
      notes: 'Gut/tendon repair',
      color: '#2ef88b',
    },
    {
      id: 2,
      name: 'TB-500',
      dose: '2.5 mg',
      timing: 'Morning',
      route: 'SubQ',
      logged: true,
      notes: 'Recovery & flexibility',
      color: '#60a5fa',
    },
    {
      id: 3,
      name: 'Sermorelin',
      dose: '300 mcg',
      timing: 'Before bed',
      route: 'SubQ',
      logged: false,
      notes: 'GH release, sleep quality',
      color: '#a78bfa',
    },
    {
      id: 4,
      name: 'PT-141',
      dose: '1 mg',
      timing: 'As needed',
      route: 'Nasal',
      logged: false,
      notes: 'Libido',
      color: '#f5a623',
    },
  ],
  supplements: [
    { id: 1, name: 'Creatine', dose: '5g', timing: 'Post-workout', logged: true },
    { id: 2, name: 'Magnesium Glycinate', dose: '400mg', timing: 'Before bed', logged: false },
    { id: 3, name: 'Vitamin D3', dose: '5000 IU', timing: 'Morning', logged: true },
    { id: 4, name: 'Omega-3', dose: '2g', timing: 'With meal', logged: true },
    { id: 5, name: 'NMN', dose: '500mg', timing: 'Morning', logged: true },
    { id: 6, name: 'Ashwagandha', dose: '600mg', timing: 'Night', logged: false },
  ],
};

export const weeklyData = [
  { date: daysAgo(6), recovery: 55, strain: 14.8, sleep: 72, hrv: 44, rhr: 57, calories: 2800 },
  { date: daysAgo(5), recovery: 68, strain: 9.2,  sleep: 80, hrv: 55, rhr: 54, calories: 2400 },
  { date: daysAgo(4), recovery: 82, strain: 15.4, sleep: 88, hrv: 68, rhr: 51, calories: 3100 },
  { date: daysAgo(3), recovery: 44, strain: 17.1, sleep: 65, hrv: 38, rhr: 60, calories: 3300 },
  { date: daysAgo(2), recovery: 71, strain: 8.3,  sleep: 84, hrv: 59, rhr: 53, calories: 2200 },
  { date: daysAgo(1), recovery: 90, strain: 6.1,  sleep: 91, hrv: 74, rhr: 50, calories: 2100 },
  { date: fmt(today), recovery: 78, strain: 11.2, sleep: 83, hrv: 62, rhr: 52, calories: 2847 },
];

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

export const sleepHistory = [
  { date: daysAgo(6), duration: 6.2, score: 72, rem: 1.1, sws: 1.4 },
  { date: daysAgo(5), duration: 7.0, score: 80, rem: 1.4, sws: 1.6 },
  { date: daysAgo(4), duration: 8.1, score: 88, rem: 1.9, sws: 2.0 },
  { date: daysAgo(3), duration: 5.8, score: 65, rem: 0.9, sws: 1.1 },
  { date: daysAgo(2), duration: 7.5, score: 84, rem: 1.7, sws: 1.8 },
  { date: daysAgo(1), duration: 8.4, score: 91, rem: 2.1, sws: 2.2 },
  { date: fmt(today),  duration: 7.4, score: 83, rem: 1.6, sws: 1.8 },
];

export const strainHistory = [
  { date: daysAgo(6), strain: 14.8, calories: 3200 },
  { date: daysAgo(5), strain: 9.2,  calories: 2600 },
  { date: daysAgo(4), strain: 15.4, calories: 3350 },
  { date: daysAgo(3), strain: 17.1, calories: 3580 },
  { date: daysAgo(2), strain: 8.3,  calories: 2490 },
  { date: daysAgo(1), strain: 6.1,  calories: 2210 },
  { date: fmt(today),  strain: 11.2, calories: 2847 },
];

export const peptideLog = [
  { date: daysAgo(1), name: 'BPC-157', dose: '250 mcg', route: 'SubQ', logged: true },
  { date: daysAgo(1), name: 'TB-500', dose: '2.5 mg', route: 'SubQ', logged: true },
  { date: daysAgo(1), name: 'Sermorelin', dose: '300 mcg', route: 'SubQ', logged: true },
  { date: daysAgo(2), name: 'BPC-157', dose: '250 mcg', route: 'SubQ', logged: true },
  { date: daysAgo(2), name: 'TB-500', dose: '2.5 mg', route: 'SubQ', logged: true },
];

export const therapyDefaults = {
  coldPlunge: { tempF: 50, durationMin: 3 },
  sauna:      { tempF: 185, durationMin: 20 },
};

// Weekly therapy history — each day can have multiple sessions
export const therapyHistory = [
  {
    date: daysAgo(6),
    coldPlunge: [{ tempF: 48, durationMin: 3, time: '7:30 AM', feeling: 4 }],
    sauna:      [{ tempF: 190, durationMin: 20, time: '6:00 PM', rounds: 2, feeling: 5 }],
  },
  {
    date: daysAgo(5),
    coldPlunge: [],
    sauna:      [{ tempF: 185, durationMin: 15, time: '7:00 PM', rounds: 1, feeling: 4 }],
  },
  {
    date: daysAgo(4),
    coldPlunge: [{ tempF: 52, durationMin: 5, time: '8:00 AM', feeling: 5 }],
    sauna:      [{ tempF: 195, durationMin: 25, time: '5:30 PM', rounds: 3, feeling: 5 }],
  },
  {
    date: daysAgo(3),
    coldPlunge: [{ tempF: 50, durationMin: 3, time: '7:15 AM', feeling: 3 }],
    sauna:      [],
  },
  {
    date: daysAgo(2),
    coldPlunge: [],
    sauna:      [{ tempF: 180, durationMin: 20, time: '6:30 PM', rounds: 2, feeling: 4 }],
  },
  {
    date: daysAgo(1),
    coldPlunge: [{ tempF: 46, durationMin: 4, time: '7:00 AM', feeling: 5 }],
    sauna:      [{ tempF: 190, durationMin: 20, time: '6:00 PM', rounds: 2, feeling: 5 }],
  },
  {
    date: fmt(today),
    coldPlunge: [{ tempF: 50, durationMin: 3, time: '7:30 AM', feeling: 4 }],
    sauna:      [],
  },
];
