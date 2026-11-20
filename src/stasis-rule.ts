import { isBornWith } from './neighbor-counts';
import { Rule, Transition } from './rule.interface';
import { CellState } from './state.interface';

export class StasisRule implements Rule {
  public readonly name = 'StasisRule';

  public matches(transition: Transition): boolean {
    return transition.kind === 'evolve'
      && !transition.current.isAlive()
      && !isBornWith(transition.liveNeighbors);
  }

  public apply(transition: Transition): CellState {
    return transition.current;
  }
}
