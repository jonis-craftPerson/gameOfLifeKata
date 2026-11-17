import { Cell } from './cell';
import { CellStateList } from './state.interface';

export type CellTheme = Record<CellStateList, string>;

const DEFAULT_THEME: CellTheme = {
  [CellStateList.Alive]: 'H',
  [CellStateList.Dead]: '·',
};

export class TerminalRenderer {
  constructor(private readonly theme: CellTheme = DEFAULT_THEME) {}

  public init(): void {
    process.stdout.write('\x1b[?25l\x1b[2J');
  }

  public render(grid: Cell[][], generation: number): void {
    const width = grid[0]?.length ?? 0;
    let output = '\x1b[H';
    output += `Generation: ${generation} | Press Ctrl+C to exit\n`;
    output += '┌' + '──'.repeat(width) + '┐\n';

    for (const row of grid) {
      const line = row.map(cell => this.theme[cell.state]).join('');
      output += `│${line}│\n`;
    }

    output += '└' + '──'.repeat(width) + '┘\n';
    process.stdout.write(output);
  }

  public cleanup(): void {
    process.stdout.write('\x1b[?25h\n');
  }
}
