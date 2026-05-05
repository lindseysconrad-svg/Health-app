import { useState } from 'react';
import './index.css';
import { WhoopProvider, useWhoop } from './context/WhoopContext';
import NavBar        from './components/NavBar';
import WhoopConnect  from './components/WhoopConnect';
import Dashboard     from './components/Dashboard';
import SleepView     from './components/SleepView';
import StrainView    from './components/StrainView';
import NutritionView from './components/NutritionView';
import TherapyView   from './components/TherapyView';
import PeptidesView  from './components/PeptidesView';
import JournalView   from './components/JournalView';
import TrendsView    from './components/TrendsView';

const views = {
  dashboard: Dashboard,
  sleep:     SleepView,
  strain:    StrainView,
  nutrition: NutritionView,
  therapy:   TherapyView,
  peptides:  PeptidesView,
  journal:   JournalView,
  trends:    TrendsView,
};

function AppInner() {
  const { connected, loading } = useWhoop();
  const [activeTab, setActiveTab] = useState('dashboard');
  const View = views[activeTab];

  if (!connected) return <WhoopConnect />;

  if (loading) {
    return (
      <div style={{ minHeight: '100dvh', background: '#080808', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ fontSize: 40 }}>⌚</div>
        <p style={{ color: '#2ef88b', fontWeight: 700, fontSize: 15 }}>Loading your WHOOP data…</p>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 'calc(var(--nav-h) + 16px)' }}>
        <View key={activeTab} />
      </div>
      <NavBar active={activeTab} onChange={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <WhoopProvider>
      <AppInner />
    </WhoopProvider>
  );
}
