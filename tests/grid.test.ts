import { describe, expect, it } from "vitest";
import { Grid } from "../src/grid";
import { AliveState, DeadState } from "../src/state.interface";
import { Cell } from "../src/cell";

describe('Grid', () => {
    it('creates a grid with given x and y dimensions', () => {
        const grid = new Grid(2, 3, new DeadState());

        expect(grid.width).toBe(2);
        expect(grid.height).toBe(3);
        expect(grid.getCell(0, 0).isAlive()).toBe(false);
    });
});

describe('Game of Life state rules', () => {
    it.each([0, 1])('dies from underpopulation when alive with %i live neighbors', (neighbors) => {
        const cell = new Cell(new AliveState());

        const nextCell = cell.evolve(neighbors);

        expect(nextCell.isAlive()).toBe(false);
    });

    it.each([2, 3])('survives when alive with %i live neighbors', (neighbors) => {
        const cell = new Cell(new AliveState());

        const nextCell = cell.evolve(neighbors);

        expect(nextCell.isAlive()).toBe(true);
    });

    it.each([4, 5, 6, 7, 8])('dies from overpopulation when alive with %i live neighbors', (neighbors) => {
        const cell = new Cell(new AliveState());

        const nextCell = cell.evolve(neighbors);

        expect(nextCell.isAlive()).toBe(false);
    });

    it.each([2, 3])('becomes alive when dead with %i live neighbors', (neighbors) => {
        const cell = new Cell(new DeadState());

        const nextCell = cell.evolve(neighbors);

        expect(nextCell.isAlive()).toBe(true);
    });

    it.each([0, 1, 4, 5, 6, 7, 8])('stays dead when dead with %i live neighbors', (neighbors) => {
        const cell = new Cell(new DeadState());

        const nextCell = cell.evolve(neighbors);

        expect(nextCell.isAlive()).toBe(false);
    });
});

describe('Grid neighbor counting', () => {
    it('returns 0 live neighbors on an empty dead grid', () => {
        const grid = new Grid(3, 3);

        expect(grid.countLiveNeighbors(1, 1)).toBe(0);
    });

    it('counts live neighbors among all 8 surrounding cells', () => {
        const grid = new Grid(3, 3);
        grid.setCellState(0, 0, new AliveState()); // top-left
        grid.setCellState(1, 0, new AliveState()); // top-center
        grid.setCellState(2, 2, new AliveState()); // bottom-right
        grid.setCellState(1, 1, new AliveState()); // center cell itself (should NOT count!)

        expect(grid.countLiveNeighbors(1, 1)).toBe(3);
    });

    it('safely handles corner and edge cells without going out of bounds', () => {
        const grid = new Grid(3, 3);
        grid.setCellState(1, 0, new AliveState());
        grid.setCellState(0, 1, new AliveState());

        expect(grid.countLiveNeighbors(0, 0)).toBe(2);
    });
});

describe('Grid bounds validation', () => {
    it('throws an error when getting a cell out of bounds', () => {
        const grid = new Grid(4, 2); // valid x: 0..3, valid y: 0..1

        expect(() => grid.getCell(-1, 0)).toThrow('Coordinates (-1, 0) are out of bounds');
        expect(() => grid.getCell(4, 0)).toThrow('Coordinates (4, 0) are out of bounds');
        expect(() => grid.getCell(0, 2)).toThrow('Coordinates (0, 2) are out of bounds');
    });

    it('throws an error when setting a cell state out of bounds', () => {
        const grid = new Grid(4, 2);

        expect(() => grid.setCellState(4, 1, new AliveState())).toThrow(
            'Coordinates (4, 1) are out of bounds'
        );
    });
});

describe('Grid nextGeneration', () => {
    it('evolves all cells simultaneously using a 3-cell horizontal blinker', () => {
        const grid = new Grid(3, 3);
        // Horizontal line in row y = 1
        grid.setCellState(0, 1, new AliveState());
        grid.setCellState(1, 1, new AliveState());
        grid.setCellState(2, 1, new AliveState());

        grid.nextGeneration();

        // Center (1,1) had 2 neighbors -> stays Alive
        // Top-center (1,0) and Bottom-center (1,2) had 3 neighbors -> become Alive
        // Left (0,1) and Right (2,1) had 1 neighbor -> die
        expect(grid.getCell(1, 0).isAlive()).toBe(true);
        expect(grid.getCell(1, 1).isAlive()).toBe(true);
        expect(grid.getCell(1, 2).isAlive()).toBe(true);
        expect(grid.getCell(0, 1).isAlive()).toBe(false);
        expect(grid.getCell(2, 1).isAlive()).toBe(false);
    });
});
