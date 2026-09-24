import type { Artwork, ArtworkMountPoint, GalleryRoom } from '../types';

/** 判断作品是否占用了某个挂点（兼容旧数据：没有 mountPointId 时按坐标回退）。 */
export const isArtworkOnMountPoint = (artwork: Artwork, point: ArtworkMountPoint): boolean => {
  if (artwork.mountPointId) return artwork.mountPointId === point.id;
  const { x, y, z } = artwork.mountPosition;
  return x === point.position.x && y === point.position.y && z === point.position.z;
};

/** 返回展厅中已被占用的挂点。 */
export const occupiedMountPoints = (room: GalleryRoom | undefined, artworks: Artwork[], excludeArtworkId?: string) => {
  if (!room) return new Set<string>();
  const occupied = new Set<string>();
  artworks.forEach((artwork) => {
    if (artwork.roomId !== room.id || artwork.id === excludeArtworkId) return;
    const point = room.mountPoints.find((candidate) => isArtworkOnMountPoint(artwork, candidate));
    if (point) occupied.add(point.id);
  });
  return occupied;
};

/** 返回展厅中第一个空闲挂点；没有空位时返回 undefined。 */
export const findFreeMountPoint = (
  room: GalleryRoom | undefined,
  artworks: Artwork[],
  excludeArtworkId?: string,
): ArtworkMountPoint | undefined => {
  if (!room) return undefined;
  const occupied = occupiedMountPoints(room, artworks, excludeArtworkId);
  return room.mountPoints.find((point) => !occupied.has(point.id));
};

/** 统计展厅空闲挂点数量。 */
export const countFreeMountPoints = (room: GalleryRoom | undefined, artworks: Artwork[], excludeArtworkId?: string) => {
  if (!room) return 0;
  const occupied = occupiedMountPoints(room, artworks, excludeArtworkId);
  return room.mountPoints.filter((point) => !occupied.has(point.id)).length;
};
