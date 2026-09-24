import { RoomType } from '../../types/enums';
import { DEFAULT_LIGHTING } from '../../constants/lighting';
import { useRoomStore } from '../../stores/roomStore';

const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  [RoomType.Main]: '主展厅 Main',
  [RoomType.Side]: '侧厅 Side',
  [RoomType.Virtual]: '虚拟厅 Virtual',
  [RoomType.Outdoor]: '户外 Outdoor',
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

  const typeDefault = DEFAULT_LIGHTING[room.roomType];
  const lightingDiffers =
    room.lighting.brightness !== typeDefault.brightness ||
    room.lighting.colorTemperature !== typeDefault.colorTemperature;

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
        展厅类型
        <select
          className="mt-2 w-full border border-[var(--color-line)] bg-[var(--color-panel)] p-3 text-[var(--color-ink)]"
          value={room.roomType}
          onChange={(event) => updateRoomType(room.id, event.target.value as RoomType)}
        >
          {Object.values(RoomType).map((roomType) => (
            <option key={roomType} value={roomType}>
              {ROOM_TYPE_LABELS[roomType]}
            </option>
          ))}
        </select>
      </label>
      <p className="mt-2 text-xs text-[var(--color-muted)]">
        切换类型会先套用该类型的默认灯光，之后的微调按展厅单独保存。
      </p>
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
          <span className="flex items-center justify-between">
            亮度
            <span className="text-[var(--color-ink)]">{room.lighting.brightness.toFixed(2)}</span>
          </span>
          <input
            className="mt-2 w-full"
            type="range"
            min="0.2"
            max="2"
            step="0.05"
            value={room.lighting.brightness}
            onChange={(event) => updateLighting(room.id, { brightness: Number(event.target.value) })}
          />
        </label>
        <label className="block text-[var(--color-muted)]">
          <span className="flex items-center justify-between">
            色温
            <span className="text-[var(--color-ink)]">{room.lighting.colorTemperature}K</span>
          </span>
          <input
            className="mt-2 w-full"
            type="range"
            min="2700"
            max="6500"
            step="100"
            value={room.lighting.colorTemperature}
            onChange={(event) => updateLighting(room.id, { colorTemperature: Number(event.target.value) })}
          />
        </label>
      </div>
      <p className="mt-3 text-xs text-[var(--color-muted)]">
        {lightingDiffers
          ? `当前灯光已按本展厅单独保存（${room.roomType} 默认：亮度 ${typeDefault.brightness.toFixed(2)} / ${typeDefault.colorTemperature}K）。`
          : `当前为 ${room.roomType} 类型的默认灯光。`}
      </p>
    </aside>
  );
}
