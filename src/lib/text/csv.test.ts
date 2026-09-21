import { describe, expect, it } from 'vitest';
import { detectDelimiter, objectsToRows, parseCsv, rowsToObjects, toCsv } from './csv';

describe('parseCsv', () => {
  it('parses a plain table', () => {
    expect(parseCsv('a,b\n1,2')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('keeps delimiters that sit inside quotes', () => {
    expect(parseCsv('name,note\n"Smith, J.",hello')).toEqual([
      ['name', 'note'],
      ['Smith, J.', 'hello'],
    ]);
  });

  it('unescapes doubled quotes', () => {
    expect(parseCsv('a\n"She said ""hi"""')).toEqual([['a'], ['She said "hi"']]);
  });

  it('keeps newlines inside a quoted field', () => {
    expect(parseCsv('a,b\n"line1\nline2",x')).toEqual([
      ['a', 'b'],
      ['line1\nline2', 'x'],
    ]);
  });

  it('handles CRLF line endings', () => {
    expect(parseCsv('a,b\r\n1,2\r\n')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('preserves empty fields', () => {
    expect(parseCsv('a,,c')).toEqual([['a', '', 'c']]);
  });
});

describe('detectDelimiter', () => {
  it('finds semicolons', () => {
    expect(detectDelimiter('a;b;c\n1;2;3')).toBe(';');
  });

  it('finds tabs', () => {
    expect(detectDelimiter('a\tb\n1\t2')).toBe('\t');
  });

  it('ignores delimiters inside quotes', () => {
    // One real semicolon, three commas that are all quoted away.
    expect(detectDelimiter('"a,b,c";d')).toBe(';');
  });

  it('defaults to a comma', () => {
    expect(detectDelimiter('single')).toBe(',');
  });
});

describe('toCsv', () => {
  it('quotes values containing the delimiter', () => {
    expect(toCsv([['Smith, J.', 'x']])).toBe('"Smith, J.",x');
  });

  it('escapes embedded quotes', () => {
    expect(toCsv([['say "hi"']])).toBe('"say ""hi"""');
  });

  it('quotes values with leading or trailing spaces', () => {
    expect(toCsv([[' padded ']])).toBe('" padded "');
  });

  it('writes null and undefined as empty', () => {
    expect(toCsv([[null, undefined, 'x']])).toBe(',,x');
  });

  it('round-trips through parseCsv', () => {
    const rows = [
      ['name', 'note'],
      ['Smith, J.', 'said "hi"'],
      ['multi\nline', ''],
    ];
    expect(parseCsv(toCsv(rows))).toEqual(rows);
  });
});

describe('rowsToObjects', () => {
  it('uses the first row as keys', () => {
    expect(
      rowsToObjects([
        ['a', 'b'],
        ['1', '2'],
      ]),
    ).toEqual([{ a: '1', b: '2' }]);
  });

  it('names blank headers by position', () => {
    expect(rowsToObjects([['a', ''], ['1', '2']])).toEqual([{ a: '1', column_2: '2' }]);
  });

  it('returns nothing when there is only a header', () => {
    expect(rowsToObjects([['a', 'b']])).toEqual([]);
  });
});

describe('objectsToRows', () => {
  it('unions keys across objects', () => {
    expect(objectsToRows([{ a: 1 }, { b: 2 }])).toEqual([
      ['a', 'b'],
      ['1', ''],
      ['', '2'],
    ]);
  });

  it('serialises nested values as JSON', () => {
    expect(objectsToRows([{ a: { x: 1 } }])).toEqual([['a'], ['{"x":1}']]);
  });
});
