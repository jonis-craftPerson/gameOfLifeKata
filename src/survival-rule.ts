import { survivesWith } from './neighbor-counts';
import { Rule, Transition } from './rule.interface';
import { CellState } from './state.interface';

export class SurvivalRule implements Rule {
  public readonly name = 'SurvivalRule';

  public matches(transition: Transition): boolean {
    return transition.kind === 'evolve'
      && transition.current.isAlive()
      && survivesWith(transition.liveNeighbors);
  }

  public apply(transition: Transition): CellState {
    return transition.current;
  }
}
