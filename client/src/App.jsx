import { useEffect, useState } from 'react';
import api from './api/client';

export default function App() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    api
      .get('/health')
      .then(() => setStatus('online'))
      .catch(() => setStatus('offline'));
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <main className="flex h-full items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Relay Chat</h1>
        <p className="mt-1 text-sm text-muted">
          Server status:{' '}
          <span className={status === 'online' ? 'text-success' : 'text-danger'}>{status}</span>
        </p>
        <button
          onClick={toggleTheme}
          className="mt-4 h-11 w-full rounded-xl bg-primary font-medium text-on-primary hover:bg-primary-hover"
        >
          Toggle theme
        </button>
      </div>
    </main>
  );
}
