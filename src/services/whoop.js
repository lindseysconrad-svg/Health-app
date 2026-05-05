const KEYS = {
  access:   'whoop_access_token',
  refresh:  'whoop_refresh_token',
  clientId: 'whoop_client_id',
  state:    'whoop_oauth_state',
};

const AUTH_URL  = 'https://api.prod.whoop.com/oauth/oauth2/auth';
const TOKEN_URL = '/api/token';   // proxied via Netlify function to avoid CORS
const API_BASE  = 'https://api.prod.whoop.com/developer/v1';
const SCOPES    = 'read:recovery read:cycles read:sleep read:workout read:profile read:body_measurement';

function randomState() {
  return btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))))
    .replace(/[^a-zA-Z0-9]/g, '');
}

// The redirect URI must match exactly what you register in the WHOOP developer portal
export function getRedirectUri() {
  const { origin, pathname } = window.location;
  return origin + pathname;
}

export const auth = {
  isConnected: () => !!localStorage.getItem(KEYS.access),
  getToken:    () => localStorage.getItem(KEYS.access),
  getClientId: () => localStorage.getItem(KEYS.clientId),

  // Build the auth URL synchronously so iOS Safari allows the redirect
  buildLoginUrl(clientId) {
    localStorage.setItem(KEYS.clientId, clientId);
    const state = randomState();
    localStorage.setItem(KEYS.state, state);
    const params = new URLSearchParams({
      client_id:     clientId,
      redirect_uri:  getRedirectUri(),
      response_type: 'code',
      scope:         SCOPES,
      state,
    });
    return `${AUTH_URL}?${params}`;
  },

  async exchangeCode(code) {
    const body = new URLSearchParams({
      grant_type:   'authorization_code',
      code,
      redirect_uri: getRedirectUri(),
      client_id:    localStorage.getItem(KEYS.clientId),
    });

    const res = await fetch(TOKEN_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`WHOOP auth failed: ${txt}`);
    }

    const data = await res.json();
    localStorage.setItem(KEYS.access, data.access_token);
    if (data.refresh_token) localStorage.setItem(KEYS.refresh, data.refresh_token);
    localStorage.removeItem(KEYS.verifier);
    return data;
  },

  async refresh() {
    const body = new URLSearchParams({
      grant_type:    'refresh_token',
      refresh_token: localStorage.getItem(KEYS.refresh),
      client_id:     localStorage.getItem(KEYS.clientId),
    });
    const res = await fetch(TOKEN_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body,
    });
    if (!res.ok) throw new Error('Token refresh failed');
    const data = await res.json();
    localStorage.setItem(KEYS.access, data.access_token);
    if (data.refresh_token) localStorage.setItem(KEYS.refresh, data.refresh_token);
  },

  logout() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  },
};

async function get(path) {
  let token = auth.getToken();
  let res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) {
    await auth.refresh();
    token = auth.getToken();
    res = await fetch(`${API_BASE}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  if (!res.ok) throw new Error(`WHOOP API ${res.status} on ${path}`);
  return res.json();
}

export const whoopApi = {
  profile:     () => get('/user/profile/basic'),
  recovery:    () => get('/recovery?limit=1'),
  sleep:       () => get('/activity/sleep?limit=1'),
  workouts:    () => get('/activity/workout?limit=10'),
  cycles:      () => get('/cycle?limit=7'),
  body:        () => get('/user/measurement/body'),
};

// ─── Map WHOOP API responses → app data shape ────────────────────────────────

export function mapRecovery(raw) {
  const r = raw?.records?.[0];
  if (!r?.score) return null;
  const s = r.score;
  return {
    score:          Math.round(s.recovery_score),
    hrv:            Math.round(s.hrv_rmssd_milli),
    rhr:            Math.round(s.resting_heart_rate),
    spo2:           Math.round(s.spo2_percentage ?? 0),
    skinTemp:       s.skin_temp_celsius ? +(s.skin_temp_celsius * 9 / 5 - 32 * 0).toFixed(1) : 0,
    status:         s.recovery_score >= 67 ? 'green' : s.recovery_score >= 34 ? 'yellow' : 'red',
    respiratoryRate: s.respiratory_rate ?? null,
  };
}

export function mapSleep(raw) {
  const r = raw?.records?.[0];
  if (!r?.score) return null;
  const s  = r.score;
  const ss = s.stage_summary;
  const ms = 3_600_000;
  const startMs = new Date(r.start).getTime();
  const endMs   = new Date(r.end).getTime();
  const totalH  = +((endMs - startMs) / ms).toFixed(1);

  return {
    score:          Math.round(s.sleep_performance_percentage),
    duration:       totalH,
    efficiency:     Math.round(s.sleep_efficiency_percentage ?? 0),
    consistency:    Math.round(s.sleep_consistency_percentage ?? 0),
    respiratoryRate: +(s.respiratory_rate ?? 0).toFixed(1),
    start:          r.start,
    end:            r.end,
    stages: {
      rem:   +((ss.total_rem_sleep_time_milli   ?? 0) / ms).toFixed(1),
      deep:  +((ss.total_slow_wave_sleep_time_milli ?? 0) / ms).toFixed(1),
      light: +((ss.total_light_sleep_time_milli  ?? 0) / ms).toFixed(1),
      awake: +((ss.total_awake_time_milli        ?? 0) / ms).toFixed(1),
    },
    disturbances: ss.disturbance_count ?? 0,
    cycles:       ss.sleep_cycle_count ?? 0,
  };
}

export function mapWorkouts(raw) {
  return (raw?.records ?? []).map(w => {
    const s  = w.score ?? {};
    const zd = s.zone_duration ?? {};
    const toMin = ms => Math.round((ms ?? 0) / 60000);
    const zones = {
      z1: toMin(zd.zone_one_milli),
      z2: toMin(zd.zone_two_milli),
      z3: toMin(zd.zone_three_milli),
      z4: toMin(zd.zone_four_milli),
      z5: toMin(zd.zone_five_milli),
    };
    const totalZoneMin = Object.values(zones).reduce((a, b) => a + b, 0) || 1;
    return {
      id:       w.id,
      name:     sportName(w.sport_id),
      icon:     sportIcon(w.sport_id),
      time:     new Date(w.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: Math.round((new Date(w.end) - new Date(w.start)) / 60000),
      strain:   +(s.strain ?? 0).toFixed(1),
      avgHr:    Math.round(s.average_heart_rate ?? 0),
      maxHr:    Math.round(s.max_heart_rate ?? 0),
      calories: Math.round((s.kilojoule ?? 0) * 0.239006),
      maxHrPct: 0,
      distance: s.distance_meter ? +(s.distance_meter / 1609.34).toFixed(2) : null,
      zones,
      zonePcts: Object.fromEntries(
        Object.entries(zones).map(([k, v]) => [k, Math.round((v / totalZoneMin) * 100)])
      ),
    };
  });
}

export function mapCycles(raw) {
  return (raw?.records ?? []).map(c => ({
    date:     c.start?.slice(0, 10),
    strain:   +(c.score?.strain ?? 0).toFixed(1),
    recovery: 0,
  }));
}

function sportName(id) {
  const m = { 0: 'Activity', 1: 'Running', 16: 'Baseball', 17: 'Basketball', 18: 'Rowing',
    19: 'Fencing', 20: 'Field Hockey', 21: 'Football', 22: 'Golf', 24: 'Ice Hockey',
    25: 'Lacrosse', 27: 'Rugby', 28: 'Sailing', 29: 'Skiing', 30: 'Soccer',
    31: 'Softball', 32: 'Squash', 33: 'Swimming', 34: 'Tennis', 35: 'Track & Field',
    36: 'Volleyball', 37: 'Water Polo', 38: 'Wrestling', 39: 'Boxing', 42: 'Dance',
    43: 'Pilates', 44: 'Yoga', 45: 'Weightlifting', 47: 'Cross Country Skiing',
    48: 'Functional Fitness', 49: 'Duathlon', 51: 'Gymnastics', 52: 'Hiking',
    53: 'Horseback Riding', 55: 'Kayaking', 56: 'Martial Arts', 57: 'Mountain Biking',
    59: 'Obstacle Course Racing', 60: 'Olympic Weightlifting', 61: 'Powerlifting',
    62: 'Rock Climbing', 63: 'Paddleboarding', 64: 'Triathlon', 65: 'Walking',
    66: 'Surfing', 67: 'Elliptical', 68: 'Stairmaster', 70: 'Meditation',
    71: 'Other', 73: 'Cycling', 74: 'Spinning', 75: 'Pickleball', 76: 'Duathlon',
  };
  return m[id] ?? 'Workout';
}

function sportIcon(id) {
  const m = { 1: '🏃', 33: '🏊', 73: '🚴', 74: '🚴', 45: '🏋️', 44: '🧘',
    30: '⚽', 17: '🏀', 34: '🎾', 52: '🥾', 56: '🥋', 65: '🚶', 70: '🧘' };
  return m[id] ?? '💪';
}
