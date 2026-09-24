import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './router';
import { useArtworkStore } from './stores/artworkStore';
import { useRoomStore } from './stores/roomStore';
import { loadLayoutSnapshot } from './utils/layoutPersistence';
import './styles/global.css';
import './styles/theme.css';

const bootstrap = async () => {
  // 先把上次保存的展厅布置（类型、灯光、作品挂点）恢复到内存，再渲染页面。
  const snapshot = await loadLayoutSnapshot();
  useRoomStore.getState().hydrate(snapshot.rooms);
  useArtworkStore.getState().hydrate(snapshot.artworks);

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <AppRouter />
    </React.StrictMode>,
  );
};

void bootstrap();
