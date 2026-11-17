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






