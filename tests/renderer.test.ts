import { describe, it, expect, vi, afterEach } from 'vitest';
import process from 'process';

import { Cell } from '../src/cell';
import { AsciiGridFormatter } from '../src/formatter';
import { GridFormatter } from '../src/formatter.interface';
import { TerminalRenderer } from '../src/renderer';
import { AliveState, DeadState } from '../src/state.interface';
import { OutputWriter } from '../src/writer.interface';

class SpyWriter implements OutputWriter {
  public write = vi.fn();
}

function cellGrid(pattern: string[]): Cell[][] {
  return pattern.map(row =>
    row.split('').map(char =>
      new Cell(char === '#' ? new AliveState() : new DeadState())
    )
  );
}

describe('TerminalRenderer', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('writes the terminal init sequence through the injected writer', () => {
    const writer = new SpyWriter();

    new TerminalRenderer(new AsciiGridFormatter(), writer).init();

    expect(writer.write).toHaveBeenCalledOnce();
    expect(writer.write).toHaveBeenCalledWith('\x1b[?25l\x1b[2J');
  });

  it('writes the cursor-restore sequence on cleanup', () => {
    const writer = new SpyWriter();

    new TerminalRenderer(new AsciiGridFormatter(), writer).cleanup();

    expect(writer.write).toHaveBeenCalledOnce();
    expect(writer.write).toHaveBeenCalledWith('\x1b[?25h\n');
  });

  it('writes cursor home followed by the formatter output', () => {
    const formatter: GridFormatter = { format: vi.fn(() => 'FRAME') };
    const writer = new SpyWriter();
    const grid = cellGrid(['#']);

    new TerminalRenderer(formatter, writer).render(grid, 3);

    expect(formatter.format).toHaveBeenCalledWith(grid, 3);
    expect(writer.write).toHaveBeenCalledOnce();
    expect(writer.write).toHaveBeenCalledWith('\x1b[HFRAME');
  });

  it('produces the full frame with the default formatter', () => {
    const writer = new SpyWriter();

    new TerminalRenderer(new AsciiGridFormatter(), writer).render(cellGrid(['#.', '.#']), 42);

    expect(writer.write).toHaveBeenCalledWith([
      '\x1b[HGeneration: 42 | Press Ctrl+C to exit',
      '┌────┐',
      '│?¿··│',
      '│··?¿│',
      '└────┘',
      '',
    ].join('\n'));
  });

  it('does not write directly to stdout', () => {
    const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const writer = new SpyWriter();
    const renderer = new TerminalRenderer(new AsciiGridFormatter(), writer);

    renderer.init();
    renderer.render(cellGrid(['#']), 0);
    renderer.cleanup();

    expect(writeSpy).not.toHaveBeenCalled();
    expect(writer.write).toHaveBeenCalledTimes(3);
  });
});
