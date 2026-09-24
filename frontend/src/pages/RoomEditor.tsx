import { useState } from 'react';
import { PropertyPanel } from '../components/common/PropertyPanel';
import { GalleryScene } from '../components/scene/GalleryScene';
import { useArtworkStore } from '../stores/artworkStore';
import { useRoomStore } from '../stores/roomStore';
import { listMountPoints } from '../utils/mountPoints';

interface MoveFeedback {
  ok: boolean;
  message: string;
}

export function RoomEditor() {
  const artworks = useArtworkStore((state) => state.artworks);
  const moveArtwork = useArtworkStore((state) => state.moveArtwork);
  const rooms = useRoomStore((state) => state.rooms);
  const [feedback, setFeedback] = useState<MoveFeedback | null>(null);

  const handleMove = (artworkId: string, roomId: string) => {
    setFeedback(moveArtwork(artworkId, roomId));
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[320px_1fr_300px]">
      <PropertyPanel />
      <section className="min-h-[70vh] overflow-hidden border border-[var(--color-line)] bg-black">
        <GalleryScene />
      </section>
      <aside className="panel p-5">
        <h2 className="text-2xl font-semibold">作品放置</h2>
        {feedback ? (
          <p
            className={`mt-3 border p-3 text-sm ${
              feedback.ok
                ? 'border-emerald-700/40 bg-emerald-900/10 text-emerald-700 dark:text-emerald-300'
                : 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
            }`}
            role="status"
          >
            {feedback.message}
          </p>
        ) : null}
        <div className="mt-4 space-y-3">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="border border-[var(--color-line)] p-3">
              <p className="font-semibold">{artwork.title}</p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                当前挂点：{artwork.mountPointId ?? '未占用挂点'}
              </p>
              <select
                className="mt-2 w-full border border-[var(--color-line)] bg-[var(--color-panel)] p-2 text-sm"
                value={artwork.roomId}
                onChange={(event) => handleMove(artwork.id, event.target.value)}
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <h3 className="mt-6 text-lg font-semibold">挂点占用</h3>
        <div className="mt-3 space-y-3 text-sm">
          {rooms.map((room) => {
            const mountPoints = listMountPoints(room, artworks);
            const freeCount = mountPoints.filter((item) => !item.occupiedBy).length;
            return (
              <div key={room.id} className="border border-[var(--color-line)] p-3">
                <p className="flex items-center justify-between">
                  <span className="font-semibold">{room.name}</span>
                  <span className="text-xs text-[var(--color-muted)]">
                    空闲 {freeCount}/{mountPoints.length}
                  </span>
                </p>
                <ul className="mt-2 space-y-1 text-xs text-[var(--color-muted)]">
                  {mountPoints.map(({ mountPoint, occupiedBy }) => (
                    <li key={mountPoint.id} className="flex items-center justify-between gap-2">
                      <span>挂点 {mountPoint.id}</span>
                      <span className={occupiedBy ? 'text-[var(--color-ink)]' : 'text-emerald-600'}>
                        {occupiedBy ? occupiedBy.title : '空闲'}
                      </span>
                    </li>
                  ))}
                  {mountPoints.length === 0 ? <li>该展厅没有挂点</li> : null}
                </ul>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
