export interface Subscription {
  cancel(): void;
}

export interface Clock {
  every(intervalMs: number, callback: () => void): Subscription;
}
