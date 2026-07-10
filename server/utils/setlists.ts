import type { Setlist } from '~~/shared/types/domain'
import { seedSetlists } from '../data/seeds'
import { readJsonFile, writeJsonFile } from './storage'

const SETLISTS_FILE = 'setlists.json'

function sortSetlists(setlists: Setlist[]) {
  return [...setlists].sort((left, right) => right.date.localeCompare(left.date))
}

async function ensureSetlists() {
  const existing = await readJsonFile<Setlist[]>(SETLISTS_FILE)
  if (existing) {
    return sortSetlists(existing)
  }

  await writeJsonFile(SETLISTS_FILE, seedSetlists)
  return sortSetlists(seedSetlists)
}

async function saveSetlists(setlists: Setlist[]) {
  const sorted = sortSetlists(setlists)
  await writeJsonFile(SETLISTS_FILE, sorted)
  return sorted
}

export async function listSetlists() {
  return ensureSetlists()
}

export async function getSetlistById(id: string) {
  const setlists = await ensureSetlists()
  return setlists.find(setlist => setlist.id === id) ?? null
}

export async function upsertSetlist(setlist: Setlist) {
  const setlists = await ensureSetlists()
  const nextSetlist = {
    ...setlist,
    updatedAt: new Date().toISOString(),
  }

  const index = setlists.findIndex(item => item.id === setlist.id)
  const nextSetlists = index === -1
    ? [...setlists, nextSetlist]
    : setlists.map(item => (item.id === setlist.id ? nextSetlist : item))

  return saveSetlists(nextSetlists)
}

export async function deleteSetlist(id: string) {
  const setlists = await ensureSetlists()
  const nextSetlists = setlists.filter(setlist => setlist.id !== id)
  await saveSetlists(nextSetlists)
}
