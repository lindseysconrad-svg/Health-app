import { createContext, useContext, useEffect, useState } from 'react';
import { auth, whoopApi, mapRecovery, mapSleep, mapWorkouts, mapCycles } from '../services/whoop';

const WhoopContext = createContext(null);

export function useWhoop() {
  return useContext(WhoopContext);
}

export function WhoopProvider({ children }) {
  const [connected,  setConnected]  = useState(auth.isConnected());
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [liveData,   setLiveData]   = useState(null);   // real WHOOP data when connected
  const [authError,  setAuthError]  = useState(null);

  // Handle OAuth callback — code in URL query string
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (!code) return;

    // Clean the URL so the code isn't visible
    window.history.replaceState({}, '', window.location.pathname);

    auth.exchangeCode(code)
      .then(() => {
        setConnected(true);
        setAuthError(null);
      })
      .catch(err => setAuthError(err.message));
  }, []);

  // Fetch all WHOOP data when connected
  useEffect(() => {
    if (!connected) return;
    setLoading(true);

    Promise.allSettled([
      whoopApi.recovery(),
      whoopApi.sleep(),
      whoopApi.workouts(),
      whoopApi.cycles(),
    ]).then(([recoveryRes, sleepRes, workoutsRes, cyclesRes]) => {
      setLiveData({
        recovery: recoveryRes.status === 'fulfilled' ? mapRecovery(recoveryRes.value) : null,
        sleep:    sleepRes.status    === 'fulfilled' ? mapSleep(sleepRes.value)       : null,
        workouts: workoutsRes.status === 'fulfilled' ? mapWorkouts(workoutsRes.value) : [],
        cycles:   cyclesRes.status   === 'fulfilled' ? mapCycles(cyclesRes.value)     : [],
      });
      setLoading(false);
    });
  }, [connected]);

  function disconnect() {
    auth.logout();
    setConnected(false);
    setLiveData(null);
  }

  return (
    <WhoopContext.Provider value={{ connected, loading, error, authError, liveData, disconnect, setConnected }}>
      {children}
    </WhoopContext.Provider>
  );
}
