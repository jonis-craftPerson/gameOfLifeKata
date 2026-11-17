export enum CellStateList {
  Dead = 'DEAD',
  Alive = 'ALIVE',
}

export type CellStateValue = CellStateList | (string & {});

export interface CellState {
  readonly value: CellStateValue;
  isAlive(): boolean;
}

export class AliveState implements CellState {
  public readonly value = CellStateList.Alive;

  public isAlive(): boolean {
    return true;
  }
}

export class DeadState implements CellState {
  public readonly value = CellStateList.Dead;

  public isAlive(): boolean {
    return false;
  }
}
