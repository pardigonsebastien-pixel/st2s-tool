const DATA_DIR = '/data';

export function dataPath(relativePath: string): string {
  const normalized = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  return `${DATA_DIR}/${normalized}`;
}

export function isValidDataPath(path: string): boolean {
  return path.startsWith(DATA_DIR);
}

export function basename(path: string): string {
  return path.split('/').pop() || '';
}

export function dirname(path: string): string {
  const parts = path.split('/');
  parts.pop();
  return parts.join('/') || '/';
}

export function join(...parts: string[]): string {
  return parts.join('/').replace(/\/+/g, '/');
}
