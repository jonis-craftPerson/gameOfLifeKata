import { Board } from './board';
import { TerminalRenderer } from './renderer';

export class Simulation {
  private timer: NodeJS.Timeout | null = null;
  private generation = 0;

  constructor(
    private board: Board,
    private readonly renderer: TerminalRenderer,
    private readonly intervalMs: number = 200
  ) {}

  public start(): void {
    if (this.timer) return;

    this.renderer.init();
    this.tick();

    this.timer = setInterval(() => {
      this.tick();
    }, this.intervalMs);
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.renderer.cleanup();
  }

  private tick(): void {
    this.renderer.render(this.board.grid, this.generation++);
    this.board = this.board.nextGeneration();
  }
}
