import type { Artwork, ArtworkMountPoint, GalleryRoom } from '../types';

export interface FreeMountPoint {
  mountPoint: ArtworkMountPoint;
  occupiedBy?: Artwork;
}

export interface MovePlan {
  ok: boolean;
  reason?: string;
  mountPoint?: ArtworkMountPoint;
}

/** 统计某展厅内各挂点当前被哪件作品占用（以作品的 mountPointId 为准）。 */
export const getMountPointOccupancy = (
  room: GalleryRoom,
  artworks: Artwork[],
): Map<string, Artwork> => {
  const occupancy = new Map<string, Artwork>();
  artworks.forEach((artwork) => {
    if (artwork.roomId === room.id && artwork.mountPointId) {
      occupancy.set(artwork.mountPointId, artwork);
    }
  });
  return occupancy;
};

/** 返回某展厅的挂点占用情况，按挂点声明顺序排列。 */
export const listMountPoints = (room: GalleryRoom, artworks: Artwork[]): FreeMountPoint[] => {
  const occupancy = getMountPointOccupancy(room, artworks);
  return room.mountPoints.map((mountPoint) => ({
    mountPoint,
    occupiedBy: occupancy.get(mountPoint.id),
  }));
};

/** 展厅是否还有空闲挂点。 */
export const hasFreeMountPoint = (room: GalleryRoom, artworks: Artwork[]): boolean => {
  const occupancy = getMountPointOccupancy(room, artworks);
  return room.mountPoints.some((mountPoint) => !occupancy.has(mountPoint.id));
};

/**
 * 为作品在目标展厅选择一个空闲挂点。
 * 目标展厅没有任何挂点或挂点全部被占用时，返回失败原因，调用方应保留作品原处。
 */
export const planArtworkMove = (
  artwork: Artwork,
  targetRoom: GalleryRoom,
  allArtworks: Artwork[],
): MovePlan => {
  if (targetRoom.id === artwork.roomId) {
    const current = targetRoom.mountPoints.find((point) => point.id === artwork.mountPointId);
    if (current) return { ok: true, mountPoint: current };
  }
  if (targetRoom.mountPoints.length === 0) {
    return { ok: false, reason: `「${targetRoom.name}」没有可用挂点，作品仍保留在原展厅。` };
  }
  const occupancy = getMountPointOccupancy(targetRoom, allArtworks);
  const freePoint = targetRoom.mountPoints.find((point) => !occupancy.has(point.id));
  if (!freePoint) {
    return {
      ok: false,
      reason: `「${targetRoom.name}」的 ${targetRoom.mountPoints.length} 个挂点已全部被占用，作品仍保留在原展厅。`,
    };
  }
  return { ok: true, mountPoint: freePoint };
};
