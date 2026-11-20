import { describe, it, expect, vi } from 'vitest';

import { Cell } from '../src/cell';
import { STANDARD_RULE_TABLE, STANDARD_RULES } from '../src/default-rules';
import { Rule } from '../src/rule.interface';
import { RuleBasedRules } from '../src/rule-based-rules';
import { TableRules } from '../src/rules';
import {
  AliveState,
  CellState,
  CellStateValue,
  DeadState,
} from '../src/state.interface';

function standardConcreteRules(): RuleBasedRules {
  return new RuleBasedRules(STANDARD_RULES);
}

describe('Concrete rule classes', () => {
  it.each([0, 1, 4, 8])('applies DeathRule when alive with %i live neighbors', neighbors => {
    const cell = new Cell(new AliveState(), standardConcreteRules());

    expect(cell.evolve(neighbors).isAlive()).toBe(false);
  });

  it.each([2, 3])('applies SurvivalRule when alive with %i live neighbors', neighbors => {
    const cell = new Cell(new AliveState(), standardConcreteRules());

    expect(cell.evolve(neighbors).isAlive()).toBe(true);
  });

  it.each([2, 3])('applies BirthRule when dead with %i live neighbors', neighbors => {
    const cell = new Cell(new DeadState(), standardConcreteRules());

    expect(cell.evolve(neighbors).isAlive()).toBe(true);
  });

  it.each([0, 1, 4, 8])('applies StasisRule when dead with %i live neighbors', neighbors => {
    const cell = new Cell(new DeadState(), standardConcreteRules());

    expect(cell.evolve(neighbors).isAlive()).toBe(false);
  });

  it('applies ToggleRule in both directions', () => {
    const rules = standardConcreteRules();
    const cell = new Cell(new AliveState(), rules);

    cell.changeState();
    expect(cell.isAlive()).toBe(false);

    cell.changeState();
    expect(cell.isAlive()).toBe(true);
  });
});

describe('Rule polymorphism', () => {
  it('produces the same transitions as the table-driven implementation', () => {
    const tableRules = new TableRules(STANDARD_RULE_TABLE);
    const concreteRules = standardConcreteRules();

    for (const neighbors of [0, 1, 2, 3, 4, 8]) {
      expect(new Cell(new AliveState(), concreteRules).evolve(neighbors).state)
        .toBe(new Cell(new AliveState(), tableRules).evolve(neighbors).state);
      expect(new Cell(new DeadState(), concreteRules).evolve(neighbors).state)
        .toBe(new Cell(new DeadState(), tableRules).evolve(neighbors).state);
    }

    const concreteToggle = new Cell(new AliveState(), concreteRules);
    const tableToggle = new Cell(new AliveState(), tableRules);
    concreteToggle.changeState();
    tableToggle.changeState();
    expect(concreteToggle.state).toBe(tableToggle.state);
  });

  it('dispatches to the first matching injected Rule', () => {
    const dormant = 'DORMANT' as CellStateValue;
    class DormantState implements CellState {
      public readonly value = dormant;
      public isAlive(): boolean { return false; }
    }

    const first: Rule = {
      name: 'DormantOnUnderpopulation',
      matches: vi.fn(() => true),
      apply: vi.fn(() => new DormantState()),
    };
    const second: Rule = {
      name: 'Never',
      matches: vi.fn(() => false),
      apply: vi.fn(() => new AliveState()),
    };

    const next = new Cell(new AliveState(), new RuleBasedRules([first, second])).evolve(1);

    expect(next.state).toBe(dormant);
    expect(first.matches).toHaveBeenCalledWith({
      kind: 'evolve',
      current: expect.any(AliveState),
      liveNeighbors: 1,
    });
    expect(second.matches).not.toHaveBeenCalled();
  });

  it('reports a transition with no matching Rule', () => {
    expect(() => new RuleBasedRules([]).evolve(new AliveState(), 2))
      .toThrow('No rule matches evolve transition from ALIVE');
  });
});
