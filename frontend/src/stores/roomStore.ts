import { create } from 'zustand';
import type { GalleryRoom, LightingConfig } from '../types';
import { RoomType } from '../types/enums';
import { rooms } from '../api/mockGallery';
import { DEFAULT_LIGHTING } from '../constants/lighting';

interface RoomState {
  rooms: GalleryRoom[];
  selectedRoomId: string;
  hydrate: (rooms: GalleryRoom[]) => void;
  updateWallColor: (roomId: string, color: string) => void;
  updateRoomType: (roomId: string, roomType: RoomType) => void;
  updateLighting: (roomId: string, patch: Partial<Pick<LightingConfig, 'brightness' | 'colorTemperature'>>) => void;
  selectRoom: (roomId: string) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  rooms,
  selectedRoomId: rooms[0]?.id ?? '',
  hydrate: (rooms) =>
    set((state) => ({
      rooms: state.rooms.map((room) => rooms.find((saved) => saved.id === room.id) ?? room),
      selectedRoomId: rooms.some((room) => room.id === state.selectedRoomId) ? state.selectedRoomId : (rooms[0]?.id ?? ''),
    })),
  updateWallColor: (roomId, color) =>
    set((state) => ({
      rooms: state.rooms.map((room) => (room.id === roomId ? { ...room, wallColor: color } : room)),
    })),
  updateRoomType: (roomId, roomType) =>
    set((state) => ({
      rooms: state.rooms.map((room) =>
        // 切换类型后先套用该类型的默认灯光，管理员之后再单独微调亮度与色温。
        room.id === roomId ? { ...room, roomType, lighting: structuredClone(DEFAULT_LIGHTING[roomType]) } : room,
      ),
    })),
  updateLighting: (roomId, patch) =>
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room.id === roomId ? { ...room, lighting: { ...room.lighting, ...patch } } : room,
      ),
    })),
  selectRoom: (roomId) => set({ selectedRoomId: roomId }),
}));
