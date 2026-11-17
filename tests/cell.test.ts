import { describe, it, expect } from 'vitest';
import { Cell } from '../src/cell';
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






