/**
 * CSV parsing and serialisation.
 *
 * Written by hand rather than pulled from a library because the rules are small
 * and the edge cases — quoted delimiters, escaped quotes, newlines inside
 * fields — are exactly the ones a naive `split(',')` gets wrong.
 */

export function detectDelimiter(text: string): string {
  const sample = text.split(/\r?\n/).slice(0, 5).join('\n');
  const candidates = [',', ';', '\t', '|'];
  let best = ',';
  let bestCount = 0;

  for (const candidate of candidates) {
    // Count only delimiters outside quotes.
    let count = 0;
    let inQuotes = false;
    for (let i = 0; i < sample.length; i += 1) {
      const char = sample[i];
      if (char === '"') inQuotes = !inQuotes;
      else if (char === candidate && !inQuotes) count += 1;
    }
    if (count > bestCount) {
      bestCount = count;
      best = candidate;
    }
  }

  return best;
}

export function parseCsv(text: string, delimiter?: string): string[][] {
  const sep = delimiter ?? detectDelimiter(text);
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  const endField = () => {
    row.push(field);
    field = '';
  };
  const endRow = () => {
    endField();
    // Ignore the trailing blank line most files end with.
    if (row.length > 1 || row[0] !== '') rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') inQuotes = true;
    else if (char === sep) endField();
    else if (char === '\r') {
      if (text[i + 1] === '\n') i += 1;
      endRow();
    } else if (char === '\n') endRow();
    else field += char;
  }

  if (field.length || row.length) endRow();
  return rows;
}

export function toCsv(rows: (string | number | null | undefined)[][], delimiter = ','): string {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const value = cell == null ? '' : String(cell);
          // Quote when the value contains anything that would break parsing.
          return /["\n\r]|^\s|\s$/.test(value) || value.includes(delimiter)
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        })
        .join(delimiter),
    )
    .join('\r\n');
}

/** Rows to array-of-objects, using the first row as keys. */
export function rowsToObjects(rows: string[][]): Record<string, string>[] {
  if (rows.length < 2) return [];
  const [header, ...body] = rows;
  const keys = header.map((key, index) => key.trim() || `column_${index + 1}`);
  return body.map((row) =>
    Object.fromEntries(keys.map((key, index) => [key, row[index] ?? ''])),
  );
}

/** Array-of-objects back to rows, with the union of all keys as the header. */
export function objectsToRows(items: Record<string, unknown>[]): string[][] {
  if (!items.length) return [];
  const keys: string[] = [];
  for (const item of items) {
    for (const key of Object.keys(item)) if (!keys.includes(key)) keys.push(key);
  }
  return [
    keys,
    ...items.map((item) =>
      keys.map((key) => {
        const value = item[key];
        if (value == null) return '';
        return typeof value === 'object' ? JSON.stringify(value) : String(value);
      }),
    ),
  ];
}
