/**
 * Fetch-based SSE reader (no DOM `EventSource`) for React Native + web.
 * Parses `data:` lines from `text/event-stream` chunks.
 */
export async function readEventStream(
  url: string,
  signal: AbortSignal,
  onDataLine: (payload: string) => void,
): Promise<void> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`SSE HTTP ${response.status}`);
  }

  const body = response.body;
  if (!body || typeof body.getReader !== 'function') {
    throw new Error('Streaming response body is not available on this runtime');
  }

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (!signal.aborted) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split(/\r\n\r\n|\n\n/);
    buffer = parts.pop() ?? '';
    for (const part of parts) {
      for (const rawLine of part.split(/\n/)) {
        const line = rawLine.replace(/\r$/, '');
        if (line.startsWith('data:')) {
          onDataLine(line.replace(/^data:\s*/, '').trim());
        }
      }
    }
  }
}
