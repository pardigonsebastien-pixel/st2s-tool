import Papa from 'papaparse';
import { readFile, writeFile } from '../../utils/fs';

const UTF8_BOM = '\uFEFF';

export interface CsvRow {
  [key: string]: string;
}

export async function readCsv(path: string): Promise<CsvRow[]> {
  try {
    let content = await readFile(path);

    if (content.startsWith(UTF8_BOM)) {
      content = content.slice(1);
    }

    const result = Papa.parse<CsvRow>(content, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value) => value.trim()
    });

    if (result.errors.length > 0) {
      console.error('CSV parse errors:', result.errors);
    }

    return result.data;
  } catch (error) {
    console.error(`Failed to read CSV from ${path}:`, error);
    return [];
  }
}

export async function writeCsv(
  path: string,
  fields: string[],
  rows: CsvRow[]
): Promise<void> {
  const csv = Papa.unparse(rows, {
    delimiter: ';',
    header: true,
    columns: fields,
    newline: '\r\n'
  });

  const contentWithBOM = UTF8_BOM + csv;

  await writeFile(path, contentWithBOM);
}

export function parseCsvString(content: string, hasHeader = true): CsvRow[] {
  let normalized = content;

  if (normalized.startsWith(UTF8_BOM)) {
    normalized = normalized.slice(1);
  }

  const result = Papa.parse<CsvRow>(normalized, {
    header: hasHeader,
    delimiter: ';',
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim()
  });

  return result.data;
}
