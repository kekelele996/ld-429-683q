import { create } from 'zustand';
import { cloneDefaultLighting } from '../constants/lighting';
import type { GalleryRoom, LightingConfig } from '../types';
import { RoomType } from '../types/enums';
import { rooms } from '../api/mockGallery';
import { loadSelectedRoomId, persistRoom, persistSelectedRoomId } from '../utils/layoutPersistence';

interface RoomState {
  rooms: GalleryRoom[];
  selectedRoomId: string;
  hydrate: (rooms: GalleryRoom[]) => void;
  updateWallColor: (roomId: string, color: string) => void;
  updateRoomType: (roomId: string, roomType: RoomType) => void;
  updateLighting: (roomId: string, patch: Partial<Pick<LightingConfig, 'brightness' | 'colorTemperature'>>) => void;
  selectRoom: (roomId: string) => void;
}

const initialSelected = loadSelectedRoomId();

export const useRoomStore = create<RoomState>((set, get) => ({
  rooms,
  selectedRoomId: rooms.some((room) => room.id === initialSelected) ? (initialSelected as string) : rooms[0]?.id ?? '',
  hydrate: (nextRooms) =>
    set((state) => ({
      rooms: nextRooms,
      selectedRoomId: nextRooms.some((room) => room.id === state.selectedRoomId)
        ? state.selectedRoomId
        : nextRooms[0]?.id ?? '',
    })),
  updateWallColor: (roomId, color) =>
    set((state) => ({
      rooms: state.rooms.map((room) => {
        if (room.id !== roomId) return room;
        const next = { ...room, wallColor: color };
        persistRoom(next);
        return next;
      }),
    })),
  updateRoomType: (roomId, roomType) =>
    set((state) => ({
      rooms: state.rooms.map((room) => {
        if (room.id !== roomId || room.roomType === roomType) return room;
        // 切换展厅类型时先套用该类型的默认灯光，之后管理员可再单独微调。
        const next = { ...room, roomType, lighting: cloneDefaultLighting(roomType) };
        persistRoom(next);
        return next;
      }),
    })),
  updateLighting: (roomId, patch) =>
    set((state) => ({
      rooms: state.rooms.map((room) => {
        if (room.id !== roomId) return room;
        const next = { ...room, lighting: { ...room.lighting, ...patch } };
        persistRoom(next);
        return next;
      }),
    })),
  selectRoom: (roomId) => {
    if (!get().rooms.some((room) => room.id === roomId)) return;
    persistSelectedRoomId(roomId);
    set({ selectedRoomId: roomId });
  },
}));
