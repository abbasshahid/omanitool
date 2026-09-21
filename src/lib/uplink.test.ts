import { describe, expect, it } from 'vitest';
import { formatBytes } from './uplink';

describe('formatBytes', () => {
  it('shows a clean zero, which is the reading the meter usually has', () => {
    expect(formatBytes(0)).toBe('0 B');
  });

  it('never shows a negative figure', () => {
    expect(formatBytes(-5)).toBe('0 B');
  });

  it('keeps whole bytes unrounded', () => {
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1023)).toBe('1023 B');
  });

  it('switches unit at 1024', () => {
    expect(formatBytes(1024)).toBe('1.0 KB');
  });

  it('drops the decimal once the number is large enough to not need it', () => {
    expect(formatBytes(9.5 * 1024)).toBe('9.5 KB');
    expect(formatBytes(20 * 1024)).toBe('20 KB');
  });

  it('scales through the units', () => {
    expect(formatBytes(5 * 1024 ** 2)).toBe('5.0 MB');
    expect(formatBytes(3 * 1024 ** 3)).toBe('3.0 GB');
    expect(formatBytes(2 * 1024 ** 4)).toBe('2.0 TB');
  });

  it('caps at terabytes rather than inventing a unit', () => {
    expect(formatBytes(5000 * 1024 ** 4)).toContain('TB');
  });
});
