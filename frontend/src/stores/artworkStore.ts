import { create } from 'zustand';
import type { Artwork } from '../types';
import { artworks } from '../api/mockGallery';
import { useRoomStore } from './roomStore';
import { planArtworkMove } from '../utils/mountPoints';
import { persistArtwork } from '../utils/layoutPersistence';

export interface MoveArtworkResult {
  ok: boolean;
  message: string;
}

interface ArtworkState {
  artworks: Artwork[];
  activeArtworkId?: string;
  hydrate: (artworks: Artwork[]) => void;
  setActiveArtwork: (artworkId?: string) => void;
  moveArtwork: (artworkId: string, roomId: string) => MoveArtworkResult;
}

export const useArtworkStore = create<ArtworkState>((set, get) => ({
  artworks,
  activeArtworkId: artworks[0]?.id,
  hydrate: (nextArtworks) =>
    set((state) => ({
      artworks: nextArtworks,
      activeArtworkId: nextArtworks.some((artwork) => artwork.id === state.activeArtworkId)
        ? state.activeArtworkId
        : nextArtworks[0]?.id,
    })),
  setActiveArtwork: (artworkId) => set({ activeArtworkId: artworkId }),
  moveArtwork: (artworkId, roomId) => {
    const artwork = get().artworks.find((item) => item.id === artworkId);
    if (!artwork) {
      return { ok: false, message: '未找到要移动的作品。' };
    }
    const targetRoom = useRoomStore.getState().rooms.find((room) => room.id === roomId);
    if (!targetRoom) {
      return { ok: false, message: '目标展厅不存在，作品保留在原展厅。' };
    }
    if (artwork.roomId === roomId) {
      return { ok: true, message: `「${artwork.title}」已在「${targetRoom.name}」，无需移动。` };
    }
    const plan = planArtworkMove(artwork, targetRoom, get().artworks);
    if (!plan.ok || !plan.mountPoint) {
      return { ok: false, message: plan.reason ?? '目标展厅没有空闲挂点，作品保留在原展厅。' };
    }
    const mountPoint = plan.mountPoint;
    set((state) => ({
      artworks: state.artworks.map((item) => {
        if (item.id !== artworkId) return item;
        const next: Artwork = {
          ...item,
          roomId,
          mountPointId: mountPoint.id,
          mountPosition: { ...mountPoint.position },
        };
        persistArtwork(next);
        return next;
      }),
    }));
    return {
      ok: true,
      message: `「${artwork.title}」已移至「${targetRoom.name}」的空闲挂点 ${mountPoint.id}。`,
    };
  },
}));
