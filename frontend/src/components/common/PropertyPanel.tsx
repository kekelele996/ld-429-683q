import { useRoomStore } from '../../stores/roomStore';
import { RoomType } from '../../types/enums';

const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  [RoomType.Main]: '主厅 Main',
  [RoomType.Side]: '侧厅 Side',
  [RoomType.Virtual]: '虚拟厅 Virtual',
  [RoomType.Outdoor]: '户外厅 Outdoor',
};

export function PropertyPanel() {
  const rooms = useRoomStore((state) => state.rooms);
  const selectedRoomId = useRoomStore((state) => state.selectedRoomId);
  const selectRoom = useRoomStore((state) => state.selectRoom);
  const updateWallColor = useRoomStore((state) => state.updateWallColor);
  const updateRoomType = useRoomStore((state) => state.updateRoomType);
  const updateLighting = useRoomStore((state) => state.updateLighting);
  const room = rooms.find((item) => item.id === selectedRoomId) ?? rooms[0];

  if (!room) return null;

  return (
    <aside className="panel p-5">
      <h2 className="text-2xl font-semibold">展厅属性</h2>
      <label className="mt-5 block text-sm text-[var(--color-muted)]">
        当前展厅
        <select
          className="mt-2 w-full border border-[var(--color-line)] bg-[var(--color-panel)] p-3 text-[var(--color-ink)]"
          value={selectedRoomId}
          onChange={(event) => selectRoom(event.target.value)}
        >
          {rooms.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-5 block text-sm text-[var(--color-muted)]">
        展厅类型（切换后先套用该类型默认灯光）
        <select
          className="mt-2 w-full border border-[var(--color-line)] bg-[var(--color-panel)] p-3 text-[var(--color-ink)]"
          value={room.roomType}
          onChange={(event) => updateRoomType(room.id, event.target.value as RoomType)}
        >
          {Object.values(RoomType).map((type) => (
            <option key={type} value={type}>
              {ROOM_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-5 block text-sm text-[var(--color-muted)]">
        墙面颜色
        <input
          className="mt-2 h-12 w-full border border-[var(--color-line)] bg-transparent"
          type="color"
          value={room.wallColor}
          onChange={(event) => updateWallColor(room.id, event.target.value)}
        />
      </label>
      <div className="mt-5 space-y-4 text-sm">
        <label className="block text-[var(--color-muted)]">
          <div className="flex items-center justify-between">
            <span>亮度</span>
            <span className="text-[var(--color-ink)]">{room.lighting.brightness.toFixed(2)}</span>
          </div>
          <input
            className="mt-2 w-full"
            type="range"
            min={0.2}
            max={2}
            step={0.05}
            value={room.lighting.brightness}
            onChange={(event) => updateLighting(room.id, { brightness: Number(event.target.value) })}
          />
        </label>
        <label className="block text-[var(--color-muted)]">
          <div className="flex items-center justify-between">
            <span>色温</span>
            <span className="text-[var(--color-ink)]">{room.lighting.colorTemperature}K</span>
          </div>
          <input
            className="mt-2 w-full"
            type="range"
            min={2700}
            max={6500}
            step={100}
            value={room.lighting.colorTemperature}
            onChange={(event) => updateLighting(room.id, { colorTemperature: Number(event.target.value) })}
          />
        </label>
        <p className="border border-[var(--color-line)] p-3 text-xs text-[var(--color-muted)]">
          调整按当前展厅单独保存；重新切换展厅类型会重置为该类型默认灯光。
        </p>
      </div>
    </aside>
  );
}
