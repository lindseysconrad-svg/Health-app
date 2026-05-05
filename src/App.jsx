import { useState } from 'react';
import './index.css';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import SleepView from './components/SleepView';
import StrainView from './components/StrainView';
import NutritionView from './components/NutritionView';
import PeptidesView from './components/PeptidesView';
import JournalView from './components/JournalView';
import TrendsView from './components/TrendsView';

const views = {
  dashboard: Dashboard,
  sleep:     SleepView,
  strain:    StrainView,
  nutrition: NutritionView,
  peptides:  PeptidesView,
  journal:   JournalView,
  trends:    TrendsView,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const View = views[activeTab];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Scrollable content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingBottom: 'calc(var(--nav-h) + 16px)',
      }}>
        <View key={activeTab} />
      </div>

      <NavBar active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
