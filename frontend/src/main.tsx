import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './router';
import { initLayoutPersistence } from './utils/layoutPersistence';
import './styles/global.css';
import './styles/theme.css';

function App() {
  const [layoutReady, setLayoutReady] = useState(false);

  useEffect(() => {
    initLayoutPersistence().finally(() => setLayoutReady(true));
  }, []);

  if (!layoutReady) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-[var(--color-muted)]">
        正在载入已保存的展厅布置…
      </div>
    );
  }

  return <AppRouter />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
