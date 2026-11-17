import { Cell } from './cell';

export interface Renderer {
  init(): void;
  render(grid: Cell[][], generation: number): void;
  cleanup(): void;
}
