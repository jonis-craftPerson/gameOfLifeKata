import { OutputWriter } from './writer.interface';

export class StdoutWriter implements OutputWriter {
  public write(text: string): void {
    process.stdout.write(text);
  }
}
