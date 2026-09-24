import { create } from 'zustand';

export type NoticeTone = 'success' | 'error';

export interface EditorNotice {
  id: number;
  tone: NoticeTone;
  message: string;
}

interface NoticeState {
  notices: EditorNotice[];
  pushNotice: (tone: NoticeTone, message: string) => void;
  dismissNotice: (id: number) => void;
}

let nextId = 1;

export const useNoticeStore = create<NoticeState>((set) => ({
  notices: [],
  pushNotice: (tone, message) => {
    const id = nextId++;
    set((state) => ({ notices: [...state.notices, { id, tone, message }] }));
    window.setTimeout(() => {
      set((state) => ({ notices: state.notices.filter((notice) => notice.id !== id) }));
    }, 5000);
  },
  dismissNotice: (id) => set((state) => ({ notices: state.notices.filter((notice) => notice.id !== id) })),
}));
