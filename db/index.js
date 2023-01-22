import { writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'

const DB_PATH = path.join(process.cwd(), './db/')

async function readDBFile(filename) {
  return await readFile(`${DB_PATH}/${filename}.json`, 'utf-8').then(JSON.parse)
}

export async function writeDBFile(filename, data) {
  return await writeFile(
    `${DB_PATH}/${filename}.json`,
    JSON.stringify(data, null, 2),
    'utf-8'
  )
}

export const TEAMS = await readDBFile('teams')
export const PRESIDENTS = await readDBFile('presidents')
