import { survivesWith } from './neighbor-counts';
import { Rule, Transition } from './rule.interface';
import { CellState, DeadState } from './state.interface';

export class DeathRule implements Rule {
  public readonly name = 'DeathRule';

  public matches(transition: Transition): boolean {
    return transition.kind === 'evolve'
      && transition.current.isAlive()
      && !survivesWith(transition.liveNeighbors);
  }

  public apply(_transition: Transition): CellState {
    return new DeadState();
  }
}
