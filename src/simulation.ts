import { Board } from './board';
import { Clock, Subscription } from './clock.interface';
import { Renderer } from './renderer.interface';

export class Simulation {
  private subscription: Subscription | null = null;
  private generation = 0;

  constructor(
    private board: Board,
    private readonly renderer: Renderer,
    private readonly clock: Clock,
    private readonly intervalMs: number = 200
  ) {}

  public start(): void {
    if (this.subscription) return;

    this.renderer.init();
    this.tick();

    this.subscription = this.clock.every(this.intervalMs, () => this.tick());
  }

  public stop(): void {
    if (this.subscription) {
      this.subscription.cancel();
      this.subscription = null;
    }
    this.renderer.cleanup();
  }

  private tick(): void {
    this.renderer.render(this.board.grid, this.generation++);
    this.board = this.board.nextGeneration();
  }
}
