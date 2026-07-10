import type { Song } from '~~/shared/types/domain'
import { seedSongs } from '../data/seeds'
import { readJsonFile, writeJsonFile } from './storage'

const SONGS_FILE = 'songs.json'

function sortSongs(songs: Song[]) {
  return [...songs].sort((left, right) => {
    const updatedDiff = right.updatedAt.localeCompare(left.updatedAt)
    return updatedDiff !== 0 ? updatedDiff : left.displayTitle.localeCompare(right.displayTitle)
  })
}

async function ensureSongs() {
  const existing = await readJsonFile<Song[]>(SONGS_FILE)
  if (existing) {
    return sortSongs(existing)
  }

  await writeJsonFile(SONGS_FILE, seedSongs)
  return sortSongs(seedSongs)
}

async function saveSongs(songs: Song[]) {
  const sorted = sortSongs(songs)
  await writeJsonFile(SONGS_FILE, sorted)
  return sorted
}

export async function listSongs() {
  return ensureSongs()
}

export async function getSongById(id: string) {
  const songs = await ensureSongs()
  return songs.find(song => song.id === id) ?? null
}

export async function upsertSong(song: Song) {
  const songs = await ensureSongs()
  const nextSong = {
    ...song,
    updatedAt: new Date().toISOString(),
  }

  const index = songs.findIndex(item => item.id === song.id)
  const nextSongs = index === -1
    ? [...songs, nextSong]
    : songs.map(item => (item.id === song.id ? nextSong : item))

  return saveSongs(nextSongs)
}

export async function deleteSong(id: string) {
  const songs = await ensureSongs()
  const nextSongs = songs.filter(song => song.id !== id)
  await saveSongs(nextSongs)
}
