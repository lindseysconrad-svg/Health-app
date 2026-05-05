import { useState } from 'react';
import { auth, getRedirectUri } from '../services/whoop';
import { useWhoop } from '../context/WhoopContext';

export default function WhoopConnect() {
  const { authError } = useWhoop();
  const [clientId, setClientId] = useState(auth.getClientId() || '');
  const [loading,  setLoading]  = useState(false);
  const [err,      setErr]      = useState('');

  const redirectUri = getRedirectUri();

  async function handleConnect() {
    if (!clientId.trim()) { setErr('Paste your Client ID first'); return; }
    setLoading(true);
    setErr('');
    try {
      await auth.login(clientId.trim());
    } catch (e) {
      setErr(e.message);
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100dvh', background: '#080808', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px 20px',
    }}>
      {/* Logo area */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>⌚</div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#f0f0f0', margin: 0 }}>Connect Your WHOOP</h1>
        <p style={{ fontSize: 13, color: '#555', marginTop: 8, lineHeight: 1.6, maxWidth: 300 }}>
          Link your WHOOP account to pull your real recovery, sleep, and strain data.
        </p>
      </div>

      {/* Step-by-step card */}
      <div style={{ width: '100%', maxWidth: 400, background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#555', letterSpacing: '0.8px', marginBottom: 16 }}>HOW TO GET YOUR CLIENT ID</p>

        {[
          ['1', 'Go to', 'developer.whoop.com', 'and sign in'],
          ['2', 'Click', 'Create New Application'],
          ['3', 'Set the Redirect URI to exactly:'],
          ['4', 'Copy your', 'Client ID', 'and paste it below'],
        ].map(([n, pre, bold, post]) => (
          <div key={n} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#2ef88b', color: '#000', fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{n}</span>
            <p style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>
              {pre} {bold && <span style={{ color: '#f0f0f0', fontWeight: 700 }}>{bold}</span>} {post}
              {n === '3' && (
                <span style={{ display: 'block', marginTop: 6, padding: '6px 10px', background: '#1a1a1a', borderRadius: 8, fontSize: 11, color: '#2ef88b', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {redirectUri}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ width: '100%', maxWidth: 400 }}>
        <input
          value={clientId}
          onChange={e => { setClientId(e.target.value); setErr(''); }}
          placeholder="Paste your WHOOP Client ID here"
          style={{
            width: '100%', background: '#111', border: `1px solid ${err ? '#ef4444' : '#2a2a2a'}`,
            borderRadius: 12, padding: '14px 16px', fontSize: 14, color: '#f0f0f0',
            outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
            marginBottom: 12,
          }}
        />

        {(err || authError) && (
          <p style={{ fontSize: 12, color: '#ef4444', marginBottom: 10, textAlign: 'center' }}>
            {err || authError}
          </p>
        )}

        <button
          onClick={handleConnect}
          disabled={loading}
          style={{
            width: '100%', padding: '15px', borderRadius: 12, fontSize: 15, fontWeight: 800,
            background: loading ? '#1a1a1a' : '#2ef88b', color: '#000',
            border: 'none', cursor: loading ? 'default' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {loading ? 'Redirecting to WHOOP…' : 'Connect WHOOP →'}
        </button>

        <p style={{ fontSize: 11, color: '#333', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
          You'll be taken to WHOOP's secure login page. We never store your WHOOP password.
        </p>
      </div>
    </div>
  );
}
