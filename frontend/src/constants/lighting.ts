import { RoomType } from '../types/enums';
import type { LightingConfig } from '../types/room';

export const DEFAULT_LIGHTING: Record<RoomType, LightingConfig> = {  [RoomType.Main]: {
    brightness: 1.15,
    colorTemperature: 4200,
    spotlights: [
      { position: { x: -4, y: 4, z: -3 }, target: { x: -4, y: 2, z: -6 }, intensity: 1.2 },
      { position: { x: 4, y: 4, z: -3 }, target: { x: 4, y: 2, z: -6 }, intensity: 1.2 },
    ],
  },
  [RoomType.Side]: {
    brightness: 0.95,
    colorTemperature: 3600,
    spotlights: [{ position: { x: 0, y: 4, z: -4 }, target: { x: 0, y: 2, z: -6 }, intensity: 1 }],
  },
  [RoomType.Virtual]: {
    brightness: 1.25,
    colorTemperature: 5000,
    spotlights: [{ position: { x: 0, y: 5, z: -1 }, target: { x: 0, y: 2, z: -6 }, intensity: 1.4 }],
  },
  [RoomType.Outdoor]: {
    brightness: 1.4,
    colorTemperature: 5600,
    spotlights: [],
  },
};

/** 返回某展厅类型默认灯光的深拷贝，避免多个展厅共享同一份聚光灯数组。 */
export const cloneDefaultLighting = (roomType: RoomType): LightingConfig => {
  const source = DEFAULT_LIGHTING[roomType];
  return {
    brightness: source.brightness,
    colorTemperature: source.colorTemperature,
    spotlights: source.spotlights.map((spot) => ({
      position: { ...spot.position },
      target: { ...spot.target },
      intensity: spot.intensity,
    })),
  };
};
