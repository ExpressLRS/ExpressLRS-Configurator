export default class EventsBatcher<T> {
  buffer: T[];
  updateEveryMs: number;
  lastUpdate: number;
  timeout: ReturnType<typeof setTimeout> | null;
  subscribers: ((calls: T[]) => void)[];

  constructor(batchDuration: number) {
    this.buffer = [];
    this.updateEveryMs = batchDuration;
    this.lastUpdate = Date.now();
    this.timeout = null;
    this.subscribers = [];
  }

  onBatch(callback: (data: T[]) => void) {
    this.subscribers.push(callback);
  }

  broadcast(data: T[]) {
    for (let i = 0; i < this.subscribers.length; i++) {
      this.subscribers[i](data);
    }
  }

  enqueue(args: T) {
    this.buffer.push(args);
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    if (Date.now() - this.lastUpdate > this.updateEveryMs) {
      this.broadcast(this.buffer);
      this.buffer = [];
      this.lastUpdate = Date.now();
    } else {
      this.timeout = setTimeout(() => {
        this.broadcast(this.buffer);
        this.buffer = [];
        this.lastUpdate = Date.now();
      }, this.updateEveryMs + 50);
    }
  }
}
