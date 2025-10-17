import { isValidDataPath } from './path';

const fileSystem = new Map<string, string>();

export async function readFile(path: string): Promise<string> {
  if (!isValidDataPath(path)) {
    throw new Error(`Invalid path: ${path}. Must be inside /data directory.`);
  }

  if (fileSystem.has(path)) {
    return fileSystem.get(path)!;
  }

  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`File not found: ${path}`);
    }
    const content = await response.text();
    fileSystem.set(path, content);
    return content;
  } catch (error) {
    throw new Error(`Failed to read file: ${path}`);
  }
}

export async function writeFile(path: string, content: string): Promise<void> {
  if (!isValidDataPath(path)) {
    throw new Error(`Invalid path: ${path}. Must be inside /data directory.`);
  }

  fileSystem.set(path, content);

  console.log(`[FS] Write to ${path}:`, content.substring(0, 100));
}

export async function fileExists(path: string): Promise<boolean> {
  if (!isValidDataPath(path)) {
    return false;
  }

  if (fileSystem.has(path)) {
    return true;
  }

  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

export async function mkdir(path: string): Promise<void> {
  if (!isValidDataPath(path)) {
    throw new Error(`Invalid path: ${path}. Must be inside /data directory.`);
  }

  console.log(`[FS] Create directory: ${path}`);
}

export function exportDataToDownload(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getAllFiles(): Map<string, string> {
  return new Map(fileSystem);
}
