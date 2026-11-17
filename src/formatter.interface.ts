import { Cell } from './cell';

export interface GridFormatter {
  format(grid: Cell[][], generation: number): string;
}
