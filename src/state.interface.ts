export enum CellStateList {
    Dead = 'DEAD',
    Alive = 'ALIVE',
}

export interface CellState {
    readonly value: CellStateList;
    isAlive(): boolean;
    toggle(): CellState;
    evolve(liveNeighbors: number): CellState;
}

export class AliveState implements CellState {
    public readonly value = CellStateList.Alive;

    public isAlive(): boolean {
        return true;
    }

    public toggle(): CellState {
        return new DeadState();
    }

    public evolve(liveNeighbors: number): CellState {
        return liveNeighbors === 2 || liveNeighbors === 3
            ? this
            : new DeadState();
    }
}

export class DeadState implements CellState {

    public readonly value = CellStateList.Dead;
    
    public isAlive(): boolean {
        return false;
    }

    public toggle(): CellState {
        return new AliveState();
    }

    public evolve(liveNeighbors: number): CellState {
        return liveNeighbors === 2 || liveNeighbors === 3 ? new AliveState() : this;
    }
}
