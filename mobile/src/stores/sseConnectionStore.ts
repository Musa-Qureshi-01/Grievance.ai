import { create } from 'zustand';

import { readEventStream } from '@/lib/sseStream';

export type SseConnectionStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error';

type SseConnectionState = {
  status: SseConnectionStatus;
  url: string | null;
  error: string | null;
  lastEventAt: number | null;
  /** Last parsed JSON payload when `data:` was valid JSON; otherwise raw string. */
  lastPayload: unknown;
  abort: AbortController | null;
  connect: (absoluteUrl: string) => void;
  disconnect: () => void;
};

export const useSseConnectionStore = create<SseConnectionState>((set, get) => ({
  status: 'idle',
  url: null,
  error: null,
  lastEventAt: null,
  lastPayload: null,
  abort: null,

  disconnect: () => {
    const { abort } = get();
    abort?.abort();
    set({ status: 'idle', abort: null, url: null });
  },

  connect: (absoluteUrl: string) => {
    get().disconnect();
    const abort = new AbortController();
    set({
      status: 'connecting',
      error: null,
      url: absoluteUrl,
      abort,
    });

    void (async () => {
      try {
        await readEventStream(absoluteUrl, abort.signal, (line) => {
          if (abort.signal.aborted) {
            return;
          }
          let parsed: unknown = line;
          try {
            parsed = JSON.parse(line) as unknown;
          } catch {
            /* keep raw string */
          }
          set({
            status: 'open',
            lastPayload: parsed,
            lastEventAt: Date.now(),
          });
        });
        if (!abort.signal.aborted) {
          set({ status: 'closed', abort: null });
        }
      } catch (e) {
        if (abort.signal.aborted) {
          set({ status: 'idle', abort: null });
          return;
        }
        set({
          status: 'error',
          error: e instanceof Error ? e.message : 'SSE error',
          abort: null,
        });
      }
    })();
  },
}));
