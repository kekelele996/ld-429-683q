import { create } from 'zustand';
import type { Artwork } from '../types';
import { artworks } from '../api/mockGallery';
import { useRoomStore } from './roomStore';
import { findFreeMountPoint } from '../utils/mountPoints';

export interface MoveResult {
  moved: boolean;
  reason?: string;
}

interface ArtworkState {
  artworks: Artwork[];
  activeArtworkId?: string;
  hydrate: (artworks: Artwork[]) => void;
  setActiveArtwork: (artworkId?: string) => void;
  /** 把作品换到目标展厅：占用该展厅一个空闲挂点；没有空位则保留原处并给出原因。 */
  moveArtwork: (artworkId: string, roomId: string) => MoveResult;
}

export const useArtworkStore = create<ArtworkState>((set, get) => ({
  artworks,
  activeArtworkId: artworks[0]?.id,
  hydrate: (artworks) => set({ artworks }),
  setActiveArtwork: (artworkId) => set({ activeArtworkId: artworkId }),
  moveArtwork: (artworkId, roomId) => {
    const state = get();
    const artwork = state.artworks.find((item) => item.id === artworkId);
    if (!artwork) return { moved: false, reason: '未找到要移动的作品' };
    if (artwork.roomId === roomId) return { moved: true };

    const targetRoom = useRoomStore.getState().rooms.find((room) => room.id === roomId);
    if (!targetRoom) return { moved: false, reason: '目标展厅不存在' };

    const freePoint = findFreeMountPoint(targetRoom, state.artworks, artwork.id);
    if (!freePoint) {
      return {
        moved: false,
        reason: `「${targetRoom.name}」的 ${targetRoom.mountPoints.length} 个挂点已全部被占用，《${artwork.title}》保留在原展厅`,
      };
    }

    set({
      artworks: state.artworks.map((item) =>
        item.id === artworkId
          ? { ...item, roomId, mountPointId: freePoint.id, mountPosition: freePoint.position }
          : item,
      ),
    });
    return { moved: true };
  },
}));
