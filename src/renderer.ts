import { CellGrid } from './cell';
import { AsciiGridFormatter } from './formatter';
import { GridFormatter } from './formatter.interface';
import { Renderer } from './renderer.interface';
import { OutputWriter } from './writer.interface';
import { StdoutWriter } from './stdout-writer';

const HIDE_CURSOR_AND_CLEAR = '\x1b[?25l\x1b[2J';
const SHOW_CURSOR = '\x1b[?25h\n';
const CURSOR_HOME = '\x1b[H';

export class TerminalRenderer implements Renderer {
  constructor(
    private readonly formatter: GridFormatter = new AsciiGridFormatter(),
    private readonly writer: OutputWriter = new StdoutWriter()
  ) {}

  public init(): void {
    this.writer.write(HIDE_CURSOR_AND_CLEAR);
  }

  public render(grid: CellGrid, generation: number): void {
    this.writer.write(CURSOR_HOME + this.formatter.format(grid, generation));
  }

  public cleanup(): void {
    this.writer.write(SHOW_CURSOR);
  }
}
