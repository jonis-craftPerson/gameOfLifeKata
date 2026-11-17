import { describe, it, expect, vi, afterEach } from 'vitest';

import { Board } from '../src/board';
import { Clock, Subscription } from '../src/clock.interface';
import { Renderer } from '../src/renderer.interface';
import { Simulation } from '../src/simulation';

class FakeClock implements Clock {
  private subscriptions: Array<{ callback: () => void; active: boolean }> = [];

  public every(_intervalMs: number, callback: () => void): Subscription {
    const entry = { callback, active: true };
    this.subscriptions.push(entry);
    return { cancel: () => { entry.active = false; } };
  }

  public tick(): void {
    for (const subscription of this.subscriptions) {
      if (subscription.active) subscription.callback();
    }
  }

  public get activeCount(): number {
    return this.subscriptions.filter(subscription => subscription.active).length;
  }
}

class SpyRenderer implements Renderer {
  public init = vi.fn();
  public render = vi.fn();
  public cleanup = vi.fn();
}

describe('Simulation wiring', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes the renderer and renders generation 0 immediately on start', () => {
    const board = Board.empty(3, 3);
    const renderer = new SpyRenderer();
    const sim = new Simulation(board, renderer, new FakeClock(), 200);

    sim.start();

    expect(renderer.init).toHaveBeenCalledOnce();
    expect(renderer.render).toHaveBeenCalledOnce();
    expect(renderer.render).toHaveBeenCalledWith(board.grid, 0);

    sim.stop();
  });

  it('schedules ticks at the injected interval', () => {
    const clock = new FakeClock();
    const everySpy = vi.spyOn(clock, 'every');
    const sim = new Simulation(Board.empty(3, 3), new SpyRenderer(), clock, 250);

    sim.start();

    expect(everySpy).toHaveBeenCalledWith(250, expect.any(Function));

    sim.stop();
  });

  it('advances generations and renders updated boards on each tick', () => {
    const initialBoard = Board.empty(3, 3);
    const gen1Board = Board.empty(3, 3);
    const gen2Board = Board.empty(3, 3);

    const nextGenSpy = vi
      .spyOn(initialBoard, 'nextGeneration')
      .mockReturnValue(gen1Board);
    vi.spyOn(gen1Board, 'nextGeneration').mockReturnValue(gen2Board);

    const renderer = new SpyRenderer();
    const clock = new FakeClock();
    const sim = new Simulation(initialBoard, renderer, clock, 200);

    sim.start();

    clock.tick();
    expect(nextGenSpy).toHaveBeenCalledOnce();
    expect(renderer.render).toHaveBeenNthCalledWith(2, gen1Board.grid, 1);

    clock.tick();
    expect(renderer.render).toHaveBeenNthCalledWith(3, gen2Board.grid, 2);

    sim.stop();
  });

  it('stops ticking and cleans up the renderer when stopped', () => {
    const renderer = new SpyRenderer();
    const clock = new FakeClock();
    const sim = new Simulation(Board.empty(3, 3), renderer, clock, 200);

    sim.start();
    sim.stop();
    clock.tick();

    expect(renderer.cleanup).toHaveBeenCalledOnce();
    expect(renderer.render).toHaveBeenCalledOnce();
    expect(clock.activeCount).toBe(0);
  });
});
