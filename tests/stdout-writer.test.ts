import { describe, it, expect, vi, afterEach } from 'vitest';
import process from 'process';

import { StdoutWriter } from '../src/stdout-writer';

describe('StdoutWriter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('writes the given text to stdout', () => {
    const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

    new StdoutWriter().write('hello');

    expect(writeSpy).toHaveBeenCalledOnce();
    expect(writeSpy).toHaveBeenCalledWith('hello');
  });
});
