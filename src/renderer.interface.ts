import { CellGrid } from './cell';

export interface Renderer {
  init(): void;
  render(grid: CellGrid, generation: number): void;
  cleanup(): void;
}
