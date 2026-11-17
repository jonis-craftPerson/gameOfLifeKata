import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { Board } from '../src/board';
import { TerminalRenderer } from '../src/renderer';
import { Simulation } from '../src/simulation';

describe('Simulation wiring', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('initializes the renderer and renders generation 0 immediately on start', () => {
    const board = Board.empty(3, 3);
    const renderer = new TerminalRenderer();

    const initSpy = vi.spyOn(renderer, 'init').mockImplementation(() => {});
    const renderSpy = vi.spyOn(renderer, 'render').mockImplementation(() => {});

    const sim = new Simulation(board, renderer, 200);
    sim.start();

    expect(initSpy).toHaveBeenCalledOnce();
    expect(renderSpy).toHaveBeenCalledOnce();
    expect(renderSpy).toHaveBeenCalledWith(board.grid, 0);

    sim.stop();
  });

  it('advances generations and renders updated boards on each interval tick', () => {
    const initialBoard = Board.empty(3, 3);
    const gen1Board = Board.empty(3, 3);
    const gen2Board = Board.empty(3, 3);

    const nextGenSpy = vi
      .spyOn(initialBoard, 'nextGeneration')
      .mockReturnValue(gen1Board);
    vi.spyOn(gen1Board, 'nextGeneration').mockReturnValue(gen2Board);

    const renderer = new TerminalRenderer();
    vi.spyOn(renderer, 'init').mockImplementation(() => {});
    const renderSpy = vi.spyOn(renderer, 'render').mockImplementation(() => {});

    const sim = new Simulation(initialBoard, renderer, 200);
    sim.start();

    // Advance 200ms -> Generation 1
    vi.advanceTimersByTime(200);
    expect(nextGenSpy).toHaveBeenCalledOnce();
    expect(renderSpy).toHaveBeenNthCalledWith(2, gen1Board.grid, 1);

    // Advance another 200ms -> Generation 2
    vi.advanceTimersByTime(200);
    expect(renderSpy).toHaveBeenNthCalledWith(3, gen2Board.grid, 2);

    sim.stop();
  });

  it('stops advancing and cleans up the renderer when stopped', () => {
    const board = Board.empty(3, 3);
    const renderer = new TerminalRenderer();

    vi.spyOn(renderer, 'init').mockImplementation(() => {});
    const renderSpy = vi.spyOn(renderer, 'render').mockImplementation(() => {});
    const cleanupSpy = vi.spyOn(renderer, 'cleanup').mockImplementation(() => {});

    const sim = new Simulation(board, renderer, 200);
    sim.start();
    sim.stop();

    vi.advanceTimersByTime(1000);

    expect(cleanupSpy).toHaveBeenCalledOnce();
    expect(renderSpy).toHaveBeenCalledOnce(); // Only generation 0 before stop()
  });
});
