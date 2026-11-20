import { Rule, Transition } from './rule.interface';
import { Rules } from './rules.interface';
import { CellState } from './state.interface';

export class RuleBasedRules implements Rules {
  constructor(private readonly rules: readonly Rule[]) {}

  public evolve(current: CellState, liveNeighbors: number): CellState {
    return this.apply({ kind: 'evolve', current, liveNeighbors });
  }

  public toggle(current: CellState): CellState {
    return this.apply({ kind: 'toggle', current });
  }

  private apply(transition: Transition): CellState {
    const rule = this.rules.find(candidate => candidate.matches(transition));

    if (!rule) {
      throw new Error(
        `No rule matches ${transition.kind} transition from ${transition.current.value}`
      );
    }

    return rule.apply(transition);
  }
}
