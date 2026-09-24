import { useNoticeStore } from '../../stores/noticeStore';

export function EditorNotices() {
  const notices = useNoticeStore((state) => state.notices);
  const dismissNotice = useNoticeStore((state) => state.dismissNotice);

  if (notices.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex w-[min(92vw,560px)] -translate-x-1/2 flex-col gap-2">
      {notices.map((notice) => (
        <div
          key={notice.id}
          role="status"
          className={`pointer-events-auto flex items-start justify-between gap-4 border p-4 text-sm shadow-line ${
            notice.tone === 'success'
              ? 'border-moss/40 bg-[var(--color-panel)] text-moss'
              : 'border-vermilion/50 bg-[var(--color-panel)] text-vermilion'
          }`}
        >
          <span>{notice.message}</span>
          <button className="text-xs uppercase tracking-widest text-[var(--color-muted)]" onClick={() => dismissNotice(notice.id)}>
            关闭
          </button>
        </div>
      ))}
    </div>
  );
}
