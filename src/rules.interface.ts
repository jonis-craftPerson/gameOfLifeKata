import { CellState, CellStateValue } from './state.interface';

export type StateFactory = () => CellState;

export interface StateRule {
  readonly nextByNeighbors: Readonly<Record<number, CellStateValue>>;
  readonly toggleTo: CellStateValue;
  readonly factory: StateFactory;
}

export type RuleTable = Readonly<Record<string, StateRule>>;

export interface Rules {
  evolve(current: CellState, liveNeighbors: number): CellState;
  toggle(current: CellState): CellState;
}
