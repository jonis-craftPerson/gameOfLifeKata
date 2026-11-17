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

describe('Board dimensions and access', () => {
  it('creates an empty board with the given dimensions', () => {
    const board = Board.empty(3, 2); // 3 rows, 2 cols

    expect(board.height).toBe(3);
    expect(board.width).toBe(2);
    expect(board.getCell(2, 1).isAlive()).toBe(false);
  });

  it('validates coordinates when getting a cell', () => {
    const board = Board.empty(2, 4); // valid rows: 0..1, cols: 0..3

    expect(() => board.getCell(-1, 0)).toThrow('Coordinates (-1, 0) are out of bounds');
    expect(() => board.getCell(2, 0)).toThrow('Coordinates (2, 0) are out of bounds');
    expect(() => board.getCell(0, 4)).toThrow('Coordinates (0, 4) are out of bounds');
  });
});

describe('Board.withCellState', () => {
  it('returns a new board with only the requested cell changed', () => {
    const board = Board.empty(3, 3);

    const next = board.withCellState(1, 1, new AliveState());

    expect(next.getCell(1, 1).isAlive()).toBe(true);
    expect(board.getCell(1, 1).isAlive()).toBe(false);
    expect(next.getCell(0, 0).isAlive()).toBe(false);
  });

  it('validates coordinates when changing a cell', () => {
    const board = Board.empty(2, 4);

    expect(() => board.withCellState(0, 4, new AliveState())).toThrow(
      'Coordinates (0, 4) are out of bounds'
    );
  });
});

describe('Board neighbor counting', () => {
  it('returns 0 live neighbors on an empty board', () => {
    expect(Board.empty(3, 3).countLiveNeighbors(1, 1)).toBe(0);
  });

  it('counts live neighbors among all 8 surrounding cells without counting the cell itself', () => {
    const board = Board.empty(3, 3)
      .withCellState(0, 0, new AliveState())
      .withCellState(0, 1, new AliveState())
      .withCellState(2, 2, new AliveState())
      .withCellState(1, 1, new AliveState());

    expect(board.countLiveNeighbors(1, 1)).toBe(3);
  });

  it('safely handles corner and edge cells without going out of bounds', () => {
    const board = Board.empty(3, 3)
      .withCellState(0, 1, new AliveState())
      .withCellState(1, 0, new AliveState());

    expect(board.countLiveNeighbors(0, 0)).toBe(2);
  });
});

describe('Board.nextGeneration', () => {
  it('evolves all cells simultaneously using a horizontal line', () => {
    const board = Board.empty(3, 3)
      .withCellState(1, 0, new AliveState())
      .withCellState(1, 1, new AliveState())
      .withCellState(1, 2, new AliveState());

    const next = board.nextGeneration();

    expect(next.getCell(0, 1).isAlive()).toBe(true);
    expect(next.getCell(1, 1).isAlive()).toBe(true);
    expect(next.getCell(2, 1).isAlive()).toBe(true);
    expect(next.getCell(1, 0).isAlive()).toBe(false);
    expect(next.getCell(1, 2).isAlive()).toBe(false);
  });
});
