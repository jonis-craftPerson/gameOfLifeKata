import { Board } from './board';
import { NodeClock } from './clock';
import { AsciiGridFormatter } from './formatter';
import { AliveState } from './state.interface';
import { TerminalRenderer } from './renderer';
import { StdoutWriter } from './stdout-writer';
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
const renderer = new TerminalRenderer(new AsciiGridFormatter(), new StdoutWriter());
const simulation = new Simulation(board, renderer, new NodeClock(), 200);

simulation.start();

process.on('SIGINT', () => {
  simulation.stop();
  process.exit(0);
});
