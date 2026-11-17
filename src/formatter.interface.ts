import { CellGrid } from './cell';

export interface GridFormatter {
  format(grid: CellGrid, generation: number): string;
}
