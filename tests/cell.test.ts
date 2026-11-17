import { describe, it, expect, vi } from 'vitest';
import { Cell } from '../src/cell';
import { Rules } from '../src/rules.interface';
import { AliveState, CellStateList, DeadState } from '../src/state.interface';


describe('Game of Life Kata', () => {
  it('tests True', () => {
    expect(true).toBe(true);
  });
});




describe('Cell', () => {
  it('Starts alive by default', () => {
    const cell = new Cell();
     expect(cell.isAlive()).toBe(true);
  });

  it('can be initialized as dead', () => {
   const cell = new Cell(new DeadState());
   expect(cell.isAlive()).toBe(false);
  });


  it('can change its state to dead', () => {
    const cell = new Cell(new AliveState()); // starts Alive

    cell.changeState();

    expect(cell.isAlive()).toBe(false);
  });
});

describe('Cell evolution rules', () => {
  it.each([0, 1])('dies from underpopulation when alive with %i live neighbors', (neighbors) => {
    const cell = new Cell(new AliveState());

    expect(cell.evolve(neighbors).isAlive()).toBe(false);
  });

  it.each([2, 3])('survives when alive with %i live neighbors', (neighbors) => {
    const cell = new Cell(new AliveState());

    expect(cell.evolve(neighbors).isAlive()).toBe(true);
  });

  it.each([4, 5, 6, 7, 8])('dies from overpopulation when alive with %i live neighbors', (neighbors) => {
    const cell = new Cell(new AliveState());

    expect(cell.evolve(neighbors).isAlive()).toBe(false);
  });

  it.each([2, 3])('becomes alive when dead with %i live neighbors', (neighbors) => {
    const cell = new Cell(new DeadState());

    expect(cell.evolve(neighbors).isAlive()).toBe(true);
  });

  it.each([0, 1, 4, 5, 6, 7, 8])('stays dead when dead with %i live neighbors', (neighbors) => {
    const cell = new Cell(new DeadState());

    expect(cell.evolve(neighbors).isAlive()).toBe(false);
  });
});

describe('Cell rules injection', () => {
  it('delegates evolution to the injected rules', () => {
    const evolve = vi.fn(() => new DeadState());
    const rules: Rules = { evolve, toggle: vi.fn(() => new AliveState()) };
    const cell = new Cell(new AliveState(), rules);

    cell.evolve(2);

    expect(evolve).toHaveBeenCalledWith(expect.any(AliveState), 2);
  });

  it('keeps using the injected rules in evolved cells', () => {
    const evolve = vi.fn(() => new DeadState());
    const rules: Rules = { evolve, toggle: vi.fn(() => new AliveState()) };
    const cell = new Cell(new AliveState(), rules).evolve(0);

    cell.evolve(0);

    expect(evolve).toHaveBeenCalledTimes(2);
  });

  it('delegates toggling to the injected rules', () => {
    const toggle = vi.fn(() => new DeadState());
    const rules: Rules = { evolve: vi.fn(() => new DeadState()), toggle };
    const cell = new Cell(new AliveState(), rules);

    cell.changeState();

    expect(toggle).toHaveBeenCalledWith(expect.any(AliveState));
    expect(cell.isAlive()).toBe(false);
  });
});






