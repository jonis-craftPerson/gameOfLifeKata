import { Board } from './board';
import { AliveState } from './state.interface';
import { TerminalRenderer } from './renderer';
import { Simulation } from './simulation';

function createSeededBoard(rows: number, cols: number): Board {
  const midR = Math.floor(rows / 2);
  const midC = Math.floor(cols / 2);
  const alive = new AliveState();

  return Board.empty(rows, cols)
    .withCellState(midR - 1, midC, alive)
    .withCellState(midR, midC, alive)
    .withCellState(midR + 1, midC, alive);
}

const board = createSeededBoard(25, 25);
const renderer = new TerminalRenderer();
const simulation = new Simulation(board, renderer, 200);

simulation.start();

process.on('SIGINT', () => {
  simulation.stop();
  process.exit(0);
});
