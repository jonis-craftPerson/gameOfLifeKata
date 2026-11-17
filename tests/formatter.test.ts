import { describe, it, expect, vi, afterEach } from 'vitest';
import process from 'process';

import { Cell } from '../src/cell';
import { AsciiGridFormatter, CellTheme } from '../src/formatter';
import { AliveState, CellStateList, DeadState } from '../src/state.interface';

function cellGrid(pattern: string[]): Cell[][] {
  return pattern.map(row =>
    row.split('').map(char =>
      new Cell(char === '#' ? new AliveState() : new DeadState())
    )
  );
}

describe('AsciiGridFormatter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('formats a grid into a bordered frame with the generation header', () => {
    const output = new AsciiGridFormatter().format(cellGrid(['#.', '.#']), 42);

    expect(output).toBe([
      'Generation: 42 | Press Ctrl+C to exit',
      '┌────┐',
      '│?¿··│',
      '│··?¿│',
      '└────┘',
      '',
    ].join('\n'));
  });

  it('uses an injected theme', () => {
    const customTheme: CellTheme = {
      [CellStateList.Alive]: 'O ',
      [CellStateList.Dead]: '. ',
    };

    const output = new AsciiGridFormatter(customTheme).format(cellGrid(['#.', '.#']), 1);

    expect(output).toBe([
      'Generation: 1 | Press Ctrl+C to exit',
      '┌────┐',
      '│O . │',
      '│. O │',
      '└────┘',
      '',
    ].join('\n'));
  });

  it('handles an empty grid', () => {
    expect(new AsciiGridFormatter().format([], 0)).toBe([
      'Generation: 0 | Press Ctrl+C to exit',
      '┌┐',
      '└┘',
      '',
    ].join('\n'));
  });

  it('is pure: repeated calls return the same string without writing to stdout', () => {
    const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const grid = cellGrid(['#.', '.#']);
    const formatter = new AsciiGridFormatter();

    expect(formatter.format(grid, 7)).toBe(formatter.format(grid, 7));
    expect(grid[0][0].isAlive()).toBe(true);
    expect(writeSpy).not.toHaveBeenCalled();
  });
});
