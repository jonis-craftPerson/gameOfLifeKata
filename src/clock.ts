import { Clock, Subscription } from './clock.interface';

export class NodeClock implements Clock {
  public every(intervalMs: number, callback: () => void): Subscription {
    const handle = setInterval(callback, intervalMs);
    return { cancel: () => clearInterval(handle) };
  }
}
