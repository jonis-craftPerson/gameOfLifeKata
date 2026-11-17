import { describe, it, expect } from 'vitest';

import { Cell } from '../src/cell';
import { RuleTable } from '../src/rules.interface';
import { stateRule, TableRules } from '../src/rules';
import { AliveState, CellState, CellStateList, CellStateValue, DeadState } from '../src/state.interface';

const DORMANT = 'DORMANT' as CellStateValue;

class DormantState implements CellState {
  public readonly value = DORMANT;
  public isAlive(): boolean { return false; }
}

const extendedTable: RuleTable = {
  [CellStateList.Alive]: stateRule(CellStateList.Alive, () => new AliveState(), [2, 3], DORMANT, DORMANT),
  [CellStateList.Dead]: stateRule(CellStateList.Dead, () => new DeadState(), [0, 1, 4, 5, 6, 7, 8], CellStateList.Alive, CellStateList.Alive),
  [DORMANT]: stateRule(DORMANT, () => new DormantState(), [0, 1, 2], CellStateList.Alive, CellStateList.Alive),
};

describe('TableRules', () => {
  const rules = new TableRules(extendedTable);

  it('takes transition decisions from the table, not from the state classes', () => {
    const cell = new Cell(new AliveState(), rules);

    expect(cell.evolve(1).state).toBe(DORMANT);
  });

  it('can transition an existing state into a newly added state', () => {
    expect(new Cell(new DeadState(), rules).evolve(2).state).toBe(CellStateList.Alive);
    expect(new Cell(new AliveState(), rules).evolve(1).state).toBe(DORMANT);
  });

  it('applies the new state rules in later generations', () => {
    const dormant = new Cell(new DormantState(), rules);

    expect(dormant.evolve(1).state).toBe(DORMANT);
    expect(dormant.evolve(3).state).toBe(CellStateList.Alive);
    expect(new Cell(new AliveState(), rules).evolve(1).evolve(3).state).toBe(CellStateList.Alive);
  });

  it('takes toggle decisions from the table', () => {
    const cell = new Cell(new AliveState(), rules);

    cell.changeState();

    expect(cell.state).toBe(DORMANT);
  });

  it('reuses the current state instance when the table maps to itself', () => {
    const alive = new AliveState();

    expect(rules.evolve(alive, 2)).toBe(alive);
  });

  it('reports a state referenced by the table but not registered', () => {
    const incompleteTable: RuleTable = {
      [CellStateList.Alive]: stateRule(CellStateList.Alive, () => new AliveState(), [], DORMANT, DORMANT),
    };

    expect(() => new TableRules(incompleteTable).evolve(new AliveState(), 0)).toThrow(
      'No rule registered for state DORMANT'
    );
  });
});
