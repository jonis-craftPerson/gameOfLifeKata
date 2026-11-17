import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Cell } from '../src/cell';
import { TerminalRenderer, CellTheme } from '../src/renderer';
import { AliveState, DeadState, CellStateList } from '../src/state.interface';
import process from 'process';


describe('TerminalRenderer', () => {
  let writeSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Intercept stdout writes so tests don't clear or draw on the real terminal
    writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('hides the cursor and clears the screen on init', () => {
    const renderer = new TerminalRenderer();

    renderer.init();

    expect(writeSpy).toHaveBeenCalledOnce();
    expect(writeSpy).toHaveBeenCalledWith('\x1b[?25l\x1b[2J');
  });

  it('restores cursor visibility on cleanup', () => {
    const renderer = new TerminalRenderer();

    renderer.cleanup();

    expect(writeSpy).toHaveBeenCalledOnce();
    expect(writeSpy).toHaveBeenCalledWith('\x1b[?25h\n');
  });

  it('renders a 2x2 grid with the default ?¿ and ·· theme and borders', () => {
    const renderer = new TerminalRenderer();
    const grid: Cell[][] = [
      [new Cell(new AliveState()), new Cell(new DeadState())],
      [new Cell(new DeadState()), new Cell(new AliveState())],
    ];

    renderer.render(grid, 42);

    const expectedOutput = [
      '\x1b[HGeneration: 42 | Press Ctrl+C to exit',
      '┌────┐',
      '│?¿··│',
      '│··?¿│',
      '└────┘',
      '', // trailing newline
    ].join('\n');

    expect(writeSpy).toHaveBeenCalledOnce();
    expect(writeSpy).toHaveBeenCalledWith(expectedOutput);
  });

  it('renders using a custom CellTheme when injected', () => {
    const customTheme: CellTheme = {
      [CellStateList.Alive]: 'O ',
      [CellStateList.Dead]: '. ',
    };
    const renderer = new TerminalRenderer(customTheme);
    const grid: Cell[][] = [
      [new Cell(new AliveState()), new Cell(new DeadState())],
    ];

    renderer.render(grid, 1);

    const expectedOutput = [
      '\x1b[HGeneration: 1 | Press Ctrl+C to exit',
      '┌────┐',
      '│O . │',
      '└────┘',
      '',
    ].join('\n');

    expect(writeSpy).toHaveBeenCalledWith(expectedOutput);
  });

  it('handles an empty grid gracefully', () => {
    const renderer = new TerminalRenderer();

    renderer.render([], 0);

    const expectedOutput = [
      '\x1b[HGeneration: 0 | Press Ctrl+C to exit',
      '┌┐',
      '└┘',
      '',
    ].join('\n');

    expect(writeSpy).toHaveBeenCalledWith(expectedOutput);
  });
});
