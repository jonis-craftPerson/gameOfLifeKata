import { Cell } from './cell';
import { GridFormatter } from './formatter.interface';
import { CellStateList } from './state.interface';

export type CellTheme = Record<CellStateList, string>;

export const DEFAULT_THEME: CellTheme = {
  [CellStateList.Alive]: '?¿',
  [CellStateList.Dead]: '··',
};

export class AsciiGridFormatter implements GridFormatter {
  constructor(private readonly theme: CellTheme = DEFAULT_THEME) {}

  public format(grid: Cell[][], generation: number): string {
    const width = grid[0]?.length ?? 0;
    let output = `Generation: ${generation} | Press Ctrl+C to exit\n`;
    output += '┌' + '──'.repeat(width) + '┐\n';

    for (const row of grid) {
      const line = row.map(cell => this.theme[cell.state]).join('');
      output += `│${line}│\n`;
    }

    output += '└' + '──'.repeat(width) + '┘\n';
    return output;
  }
}
