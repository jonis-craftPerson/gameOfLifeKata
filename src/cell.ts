import {
  AliveState,
  CellState,
  CellStateList
} from './state.interface';

export class Cell {

  constructor(private currentState: CellState = new AliveState()) { }

   public get state(): CellStateList {
    return this.currentState.value;
  }


  public isAlive(): boolean {
    return this.currentState.isAlive();
  }

  public changeState(): void {
    this.currentState = this.currentState.toggle();
  }

  public evolve(liveNeighbors: number): Cell {
    return new Cell(this.currentState.evolve(liveNeighbors));
  }
}
