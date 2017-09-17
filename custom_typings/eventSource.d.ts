interface EventSourceMap {
  "error": Event;
  "message": MessageEvent;
  "open": Event;
}

interface EventSourceConfig {
  withCredentials?: boolean;
}

interface EventSource extends EventTarget {
  readonly readyState: number;
  readonly url: string;
  readonly withCredentials: boolean;
  readonly CONNECTING: number;
  readonly OPEN: number;
  readonly CLOSED: number;
  onopen: (this: EventSource, ev: Event) => any;
  onmessage: (this: EventSource, ev: MessageEvent) => any;
  onerror: (this: EventSource, ev: Event) => any;
  close: () => void;
  addEventListener<K extends keyof EventSourceMap>(type: K, listener: (this: WebSocket, ev: EventSourceMap[K]) => any, useCapture?: boolean): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
}

declare var EventSource: {
  prototype: EventSource;
  new(url: string, configuration?: EventSourceConfig): EventSource;
  readonly CONNECTING: number;
  readonly OPEN: number;
  readonly CLOSED: number;
}
