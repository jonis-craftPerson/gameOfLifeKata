import { Rules, RuleTable, StateFactory, StateRule } from './rules.interface';
import { CellState, CellStateValue } from './state.interface';

export function stateRule(
  value: CellStateValue,
  factory: StateFactory,
  staysOn: readonly number[],
  becomes: CellStateValue,
  toggleTo: CellStateValue
): StateRule {
  const nextByNeighbors: Record<number, CellStateValue> = {};

  for (let neighbors = 0; neighbors <= 8; neighbors++) {
    nextByNeighbors[neighbors] = staysOn.includes(neighbors) ? value : becomes;
  }

  return { nextByNeighbors, toggleTo, factory };
}

export class TableRules implements Rules {
  constructor(private readonly table: RuleTable) {}

  public evolve(current: CellState, liveNeighbors: number): CellState {
    const rule = this.ruleFor(current);
    const next = rule?.nextByNeighbors[liveNeighbors] ?? current.value;
    return this.transitionTo(next, current);
  }

  public toggle(current: CellState): CellState {
    const rule = this.ruleFor(current);
    return this.transitionTo(rule?.toggleTo ?? current.value, current);
  }

  private ruleFor(state: CellState): StateRule | undefined {
    return this.table[state.value];
  }

  private transitionTo(value: CellStateValue, current: CellState): CellState {
    if (value === current.value) return current;

    const targetRule = this.table[value];
    if (!targetRule) {
      throw new Error(`No rule registered for state ${value}`);
    }
    return targetRule.factory();
  }
}
