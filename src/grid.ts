import { Cell } from "./cell";
import { CellState, DeadState } from "./state.interface";

export class Grid {
    private cells: Cell[][];

    constructor(
        public readonly width: number,  // x dimension
        public readonly height: number, // y dimension
        initialState: CellState = new DeadState()) {

        this.cells = Array.from({ length: height }, () =>
            Array.from({ length: width }, () => new Cell(initialState))
        );
    }

    public getCell(x: number, y: number): Cell {
        this.assertWithinBounds(x, y);
        return this.cells[y][x];
    }


    public setCellState(x: number, y: number, state: CellState): void {
        this.assertWithinBounds(x, y);

        this.cells[y][x] = new Cell(state);
    }

    private assertWithinBounds(x: number, y: number): void {
        if (!this.isWithinBounds(x, y)) {
            throw new RangeError(
                `Coordinates (${x}, ${y}) are out of bounds for grid of size ${this.width}x${this.height}`
            );
        }
    }

    public countLiveNeighbors(x: number, y: number): number {
        let liveNeighbors = 0;

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                // Skip the cell itself
                if (dx === 0 && dy === 0) continue;

                const neighborX = x + dx;
                const neighborY = y + dy;

                if (this.isWithinBounds(neighborX, neighborY) && this.getCell(neighborX, neighborY).isAlive()) {
                    liveNeighbors++;
                }
            }
        }

        return liveNeighbors;
    }

    private isWithinBounds(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }


    public nextGeneration(): void {
        this.cells = Array.from({ length: this.height }, (_, y) =>
            Array.from({ length: this.width }, (_, x) => {
                const liveNeighbors = this.countLiveNeighbors(x, y);
                return this.getCell(x, y).evolve(liveNeighbors);
            })
        );
    }


}