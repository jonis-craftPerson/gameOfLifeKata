import { Cell } from './cell';
import { CellState, DeadState } from './state.interface';

export class Board {
  constructor(public readonly grid: Cell[][]) {}

  public get width(): number {
    return this.grid[0]?.length ?? 0;
  }

  public get height(): number {
    return this.grid.length;
  }

  public static empty(rows: number, cols: number): Board {
    const grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => new Cell(new DeadState()))
    );
    return new Board(grid);
  }

  public getCell(row: number, col: number): Cell {
    this.assertWithinBounds(row, col);
    return this.grid[row][col];
  }

  public withCellState(row: number, col: number, state: CellState): Board {
    this.assertWithinBounds(row, col);

    const nextGrid = this.grid.map((cells, rowIndex) =>
      rowIndex === row
        ? cells.map((cell, colIndex) =>
            colIndex === col ? new Cell(state) : cell
          )
        : cells
    );

    return new Board(nextGrid);
  }

  public countLiveNeighbors(row: number, col: number): number {
    let count = 0;

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;

        if (this.isAliveAt(row + dr, col + dc)) {
          count++;
        }
      }
    }

    return count;
  }

  public nextGeneration(): Board {
    const nextGrid = this.grid.map((cells, row) =>
      cells.map((cell, col) => cell.evolve(this.countLiveNeighbors(row, col)))
    );

    return new Board(nextGrid);
  }

  private isAliveAt(row: number, col: number): boolean {
    return this.isWithinBounds(row, col) && this.grid[row][col].isAlive();
  }

  private isWithinBounds(row: number, col: number): boolean {
    return row >= 0 && row < this.height && col >= 0 && col < this.width;
  }

  private assertWithinBounds(row: number, col: number): void {
    if (!this.isWithinBounds(row, col)) {
      throw new RangeError(
        `Coordinates (${row}, ${col}) are out of bounds for board of size ${this.width}x${this.height}`
      );
    }
  }
}
