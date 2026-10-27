import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './ui/App';
import './ui.css';
import './theme.css';
import './logos.css';

class AppErrorBoundary extends React.Component<React.PropsWithChildren, { error: string | null }> {
  state = { error: null as string | null };

  static getDerivedStateFromError(error: unknown) {
    return { error: error instanceof Error ? error.message : 'An unexpected display error occurred.' };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('OAuth Atlas render failure:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, color: '#f7fbff', background: '#002a3f', fontFamily: 'Inter, Arial, sans-serif' }}>
        <section style={{ width: 'min(100%, 520px)', padding: 28, border: '1px solid rgba(255,255,255,.2)', borderRadius: 16, background: 'rgba(5,25,37,.85)' }}>
          <p style={{ margin: 0, color: '#b6bdc5', fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase' }}>OAuth Atlas</p>
          <h1 style={{ margin: '14px 0 8px', fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 400 }}>This page hit a snag.</h1>
          <p style={{ color: '#b6bdc5', lineHeight: 1.6 }}>The page stopped while rendering. Here is the error detail to help us fix it:</p>
          <code style={{ display: 'block', padding: 12, marginTop: 12, borderRadius: 8, background: 'rgba(0,0,0,.28)', color: '#fff', fontSize: 13, overflowWrap: 'anywhere' }}>{this.state.error}</code>
          <p style={{ color: '#b6bdc5', lineHeight: 1.6, fontSize: 13 }}>You can send this error text to me. It does not include your API keys.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            <button onClick={() => window.location.reload()} style={{ padding: '11px 16px', border: 0, borderRadius: 999, background: '#fff', color: '#06131b', cursor: 'pointer' }}>Reload page</button>
            <a href="/explore" style={{ padding: '11px 16px', border: '1px solid rgba(255,255,255,.3)', borderRadius: 999, color: '#fff', textDecoration: 'none' }}>Back to library</a>
          </div>
        </section>
      </main>;
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><AppErrorBoundary><BrowserRouter><App /></BrowserRouter></AppErrorBoundary></React.StrictMode>);

