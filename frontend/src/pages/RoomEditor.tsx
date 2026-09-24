import { PropertyPanel } from '../components/common/PropertyPanel';
import { EditorNotices } from '../components/common/EditorNotices';
import { GalleryScene } from '../components/scene/GalleryScene';
import { useArtworkStore } from '../stores/artworkStore';
import { useNoticeStore } from '../stores/noticeStore';
import { useRoomStore } from '../stores/roomStore';
import { occupiedMountPoints } from '../utils/mountPoints';

export function RoomEditor() {
  const artworks = useArtworkStore((state) => state.artworks);
  const moveArtwork = useArtworkStore((state) => state.moveArtwork);
  const rooms = useRoomStore((state) => state.rooms);
  const pushNotice = useNoticeStore((state) => state.pushNotice);

  const handleMove = (artworkId: string, roomId: string) => {
    const result = moveArtwork(artworkId, roomId);
    if (!result.moved) {
      pushNotice('error', result.reason ?? '作品无法移动');
      return;
    }
    const artwork = artworks.find((item) => item.id === artworkId);
    const room = rooms.find((item) => item.id === roomId);
    if (artwork && room) {
      pushNotice('success', `《${artwork.title}》已移入「${room.name}」并占用一个空闲挂点`);
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[320px_1fr_300px]">
      <PropertyPanel />
      <section className="min-h-[70vh] overflow-hidden border border-[var(--color-line)] bg-black">
        <GalleryScene />
      </section>
      <aside className="panel p-5">
        <h2 className="text-2xl font-semibold">作品放置</h2>
        <p className="mt-2 text-xs text-[var(--color-muted)]">
          换展厅时自动占用目标展厅的空闲挂点；挂点占满后作品会保留在原处。布置自动保存，重开浏览器仍生效。
        </p>
        <div className="mt-4 space-y-3">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="border border-[var(--color-line)] p-3">
              <p className="font-semibold">{artwork.title}</p>
              <select
                className="mt-2 w-full border border-[var(--color-line)] bg-[var(--color-panel)] p-2 text-sm"
                value={artwork.roomId}
                onChange={(event) => handleMove(artwork.id, event.target.value)}
              >
                {rooms.map((room) => {
                  const total = room.mountPoints.length;
                  const used = occupiedMountPoints(room, artworks, artwork.id).size;
                  return (
                    <option key={room.id} value={room.id}>
                      {room.name}（挂点 {used}/{total}）
                    </option>
                  );
                })}
              </select>
            </div>
          ))}
        </div>
      </aside>
      <EditorNotices />
    </div>
  );
}
