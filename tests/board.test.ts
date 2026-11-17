import { describe, it, expect } from 'vitest';
import { Cell } from '../src/cell';
import { AliveState, DeadState } from '../src/state.interface';
import { Board } from '../src/board';


// Helper to build readable grids in tests ('#' = Alive, '.' = Dead)
function createBoardFromAscii(pattern: string[]): Board {
  const grid = pattern.map(row =>
    row.split('').map(char =>
      new Cell(char === '#' ? new AliveState() : new DeadState())
    )
  );
  return new Board(grid);
}

// Helper to serialize a Board back to ASCII for clean assertions
function toAscii(board: Board): string[] {
  return board.grid.map(row =>
    row.map(cell => (cell.isAlive() ? '#' : '.')).join('')
  );
}

describe('Board', () => {
  it('stores and exposes the initial grid of cells', () => {
    const board = createBoardFromAscii([
      '...',
      '.#.',
      '...',
    ]);

    expect(board.grid).toHaveLength(3);
    expect(board.grid[1][1].isAlive()).toBe(true);
    expect(board.grid[0][0].isAlive()).toBe(false);
  });

  it('kills an isolated live cell due to underpopulation', () => {
    const board = createBoardFromAscii([
      '...',
      '.#.',
      '...',
    ]);

    const next = board.nextGeneration();

    expect(toAscii(next)).toEqual([
      '...',
      '...',
      '...',
    ]);
  });

  it('expands a 2x2 Block outward when dead cells reproduce on 2 or 3 neighbors', () => {
    const board = createBoardFromAscii([
      '....',
      '.##.',
      '.##.',
      '....',
    ]);

    const next = board.nextGeneration();

    expect(toAscii(next)).toEqual([
      '.##.',
      '####',
      '####',
      '.##.',
    ]);
  });

  it('evolves a vertical line of three cells across two generations under B23/S23 rules', () => {
    const board = createBoardFromAscii([
      '.....',
      '..#..',
      '..#..',
      '..#..',
      '.....',
    ]);

    const gen1 = board.nextGeneration();
    expect(toAscii(gen1)).toEqual([
      '.....',
      '.#.#.',
      '.###.',
      '.#.#.',
      '.....',
    ]);

    const gen2 = gen1.nextGeneration();
    expect(toAscii(gen2)).toEqual([
      '..#..',
      '##.##',
      '##.##',
      '##.##',
      '..#..',
    ]);
  });

  it('does not mutate the original board when advancing generations', () => {
    const board = createBoardFromAscii([
      '...',
      '.#.',
      '...',
    ]);

    board.nextGeneration();

    expect(board.grid[1][1].isAlive()).toBe(true);
  });
});
