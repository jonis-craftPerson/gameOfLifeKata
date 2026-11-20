import { Rule, Transition } from './rule.interface';
import { AliveState, CellState, DeadState } from './state.interface';

export class ToggleRule implements Rule {
  public readonly name = 'ToggleRule';

  public matches(transition: Transition): boolean {
    return transition.kind === 'toggle';
  }

  public apply(transition: Transition): CellState {
    return transition.current.isAlive() ? new DeadState() : new AliveState();
  }
}
