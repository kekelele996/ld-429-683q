import { artworks as mockArtworks, rooms as mockRooms } from '../api/mockGallery';
import type { Artwork, GalleryRoom } from '../types';
import { db } from './db';

export interface LayoutSnapshot {
  rooms: GalleryRoom[];
  artworks: Artwork[];
}

const SELECTED_ROOM_KEY = 'virtual-gallery-tour:selected-room';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/**
 * 启动时读取展厅布置：IndexedDB 里已有保存过的布置就直接使用，
 * 首次打开（表为空）则写入一份 mock 初始数据作为种子。
 * IndexedDB 不可用时回退到 mock 数据，保证页面仍可渲染。
 */
export const loadLayoutSnapshot = async (): Promise<LayoutSnapshot> => {
  try {
    const [storedRooms, storedArtworks] = await Promise.all([db.rooms.toArray(), db.artworks.toArray()]);
    if (storedRooms.length === 0) {
      await db.rooms.bulkPut(clone(mockRooms));
    }
    if (storedArtworks.length === 0) {
      await db.artworks.bulkPut(clone(mockArtworks));
    }
    return {
      rooms: storedRooms.length > 0 ? storedRooms : clone(mockRooms),
      artworks: storedArtworks.length > 0 ? storedArtworks : clone(mockArtworks),
    };
  } catch (error) {
    console.warn('[layout] 读取本地布置失败，回退到默认数据。', error);
    return { rooms: clone(mockRooms), artworks: clone(mockArtworks) };
  }
};

/** 单个展厅的布置（类型、灯光、墙色等）变更后写入 IndexedDB。 */
export const persistRoom = (room: GalleryRoom): void => {
  db.rooms.put(clone(room)).catch((error) => {
    console.warn(`[layout] 保存展厅 ${room.id} 失败。`, error);
  });
};

/** 单件作品的归属展厅/挂点变更后写入 IndexedDB。 */
export const persistArtwork = (artwork: Artwork): void => {
  db.artworks.put(clone(artwork)).catch((error) => {
    console.warn(`[layout] 保存作品 ${artwork.id} 失败。`, error);
  });
};

export const loadSelectedRoomId = (): string | null => {
  try {
    return window.localStorage.getItem(SELECTED_ROOM_KEY);
  } catch {
    return null;
  }
};

export const persistSelectedRoomId = (roomId: string): void => {
  try {
    window.localStorage.setItem(SELECTED_ROOM_KEY, roomId);
  } catch {
    // localStorage 不可用时忽略，不影响布置本身的持久化。
  }
};
