import { isBornWith } from './neighbor-counts';
import { Rule, Transition } from './rule.interface';
import { AliveState, CellState } from './state.interface';

export class BirthRule implements Rule {
  public readonly name = 'BirthRule';

  public matches(transition: Transition): boolean {
    return transition.kind === 'evolve'
      && !transition.current.isAlive()
      && isBornWith(transition.liveNeighbors);
  }

  public apply(_transition: Transition): CellState {
    return new AliveState();
  }
}
