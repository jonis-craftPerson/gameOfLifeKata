import { standardRules } from './default-rules';
import { Rules } from './rules.interface';
import { AliveState, CellState, CellStateValue } from './state.interface';

export class Cell {
  constructor(
    private currentState: CellState = new AliveState(),
    private readonly rules: Rules = standardRules
  ) {}

  public get state(): CellStateValue {
    return this.currentState.value;
  }

  public isAlive(): boolean {
    return this.currentState.isAlive();
  }

  public changeState(): void {
    this.currentState = this.rules.toggle(this.currentState);
  }

  public evolve(liveNeighbors: number): Cell {
    return new Cell(this.rules.evolve(this.currentState, liveNeighbors), this.rules);
  }
}
