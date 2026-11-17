import { Board } from './board';
import { Cell } from './cell';
import { AliveState, DeadState } from './state.interface';
import { TerminalRenderer } from './renderer';
import { Simulation } from './simulation';

function createSeededBoard(rows: number, cols: number): Board {
  const grid: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => new Cell(new DeadState()))
  );

  const midR = Math.floor(rows / 2);
  const midC = Math.floor(cols / 2);

  grid[midR - 1][midC] = new Cell(new AliveState());
  grid[midR][midC] = new Cell(new AliveState());
  grid[midR + 1][midC] = new Cell(new AliveState());

  return new Board(grid);
}

const board = createSeededBoard(25, 25);
const renderer = new TerminalRenderer();
const simulation = new Simulation(board, renderer, 200);

simulation.start();

process.on('SIGINT', () => {
  simulation.stop();
  process.exit(0);
});
