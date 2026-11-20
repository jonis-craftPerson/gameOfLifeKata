import { CellState } from './state.interface';

export type Transition =
  | {
      readonly kind: 'evolve';
      readonly current: CellState;
      readonly liveNeighbors: number;
    }
  | {
      readonly kind: 'toggle';
      readonly current: CellState;
    };

export interface Rule {
  readonly name: string;
  matches(transition: Transition): boolean;
  apply(transition: Transition): CellState;
}
