import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

export function resolveDataPath(fileName: string) {
  return resolve(process.cwd(), 'server', 'data', fileName)
}

export async function readJsonFile<T>(fileName: string): Promise<T | null> {
  try {
    const contents = await readFile(resolveDataPath(fileName), 'utf-8')
    return JSON.parse(contents) as T
  }
  catch {
    return null
  }
}

export async function writeJsonFile<T>(fileName: string, data: T) {
  const filePath = resolveDataPath(fileName)
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}
