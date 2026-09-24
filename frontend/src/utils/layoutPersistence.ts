import { db } from './db';
import { rooms as seedRooms } from '../api/mockGallery';
import { artworks as seedArtworks } from '../api/mockGallery';
import { useRoomStore } from '../stores/roomStore';
import { useArtworkStore } from '../stores/artworkStore';

let hydratePromise: Promise<void> | null = null;
let bound = false;

/**
 * 从 IndexedDB 载入管理员保存的布置。
 * 首次访问（表为空）时写入 mock 初始数据；数据库不可用时静默回退到内存数据。
 */
export const hydrateLayout = (): Promise<void> => {
  if (hydratePromise) return hydratePromise;
  hydratePromise = (async () => {
    try {
      const [savedRooms, savedArtworks] = await Promise.all([db.rooms.toArray(), db.artworks.toArray()]);
      if (savedRooms.length === 0 && savedArtworks.length === 0) {
        await Promise.all([db.rooms.bulkPut(seedRooms), db.artworks.bulkPut(seedArtworks)]);
        return;
      }
      if (savedRooms.length > 0) {
        useRoomStore.getState().hydrate(savedRooms);
      }
      if (savedArtworks.length > 0) {
        useArtworkStore.getState().hydrate(savedArtworks);
      }
    } catch (error) {
      // IndexedDB 被禁用（如隐私模式）时仅丢失持久化，页面仍可正常使用。
      console.warn('布置数据读取失败，回退到初始数据', error);
    }
  })();
  return hydratePromise;
};

/** 订阅 stores 的变更，把展厅布置实时写入 IndexedDB。 */
export const bindLayoutPersistence = () => {
  if (bound) return;
  bound = true;
  const persistRoom = (id: string) => {
    const room = useRoomStore.getState().rooms.find((item) => item.id === id);
    if (room) db.rooms.put(room).catch((error) => console.warn('展厅布置保存失败', error));
  };
  const persistArtwork = (id: string) => {
    const artwork = useArtworkStore.getState().artworks.find((item) => item.id === id);
    if (artwork) db.artworks.put(artwork).catch((error) => console.warn('作品布置保存失败', error));
  };
  useRoomStore.subscribe((state, previousState) => {
    if (state.rooms === previousState.rooms) return;
    state.rooms.forEach((room) => {
      if (previousState.rooms.find((item) => item.id === room.id) !== room) persistRoom(room.id);
    });
  });
  useArtworkStore.subscribe((state, previousState) => {
    if (state.artworks === previousState.artworks) return;
    state.artworks.forEach((artwork) => {
      if (previousState.artworks.find((item) => item.id === artwork.id) !== artwork) persistArtwork(artwork.id);
    });
  });
};

/** 应用启动入口：先同步本地布置，再让编辑器改动实时落库。 */
export const initLayoutPersistence = async () => {
  bindLayoutPersistence();
  await hydrateLayout();
};
