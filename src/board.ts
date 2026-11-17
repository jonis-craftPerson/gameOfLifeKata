import { Cell } from './cell';
import { DeadState } from './state.interface';

export class Board {
  constructor(public readonly grid: Cell[][]) {}

  public static empty(rows: number, cols: number): Board {
    const grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => new Cell(new DeadState()))
    );
    return new Board(grid);
  }

  public nextGeneration(): Board {
    const nextGrid = this.grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        const liveNeighbors = this.countLiveNeighbors(rowIndex, colIndex);
        return cell.evolve(liveNeighbors);
      })
    );

    return new Board(nextGrid);
  }

  private countLiveNeighbors(row: number, col: number): number {
    let count = 0;

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;

        const neighborRow = row + dr;
        const neighborCol = col + dc;

        if (this.isAliveAt(neighborRow, neighborCol)) {
          count++;
        }
      }
    }

    return count;
  }

  private isAliveAt(row: number, col: number): boolean {
    if (row < 0 || row >= this.grid.length) return false;
    if (col < 0 || col >= this.grid[row].length) return false;

    return this.grid[row][col].isAlive();
  }
}
