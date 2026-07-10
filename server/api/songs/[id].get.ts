import { getRouterParam } from 'h3'
import { getSongById } from '../../utils/songs'

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Song id is required' })
  }

  const song = await getSongById(id)

  if (!song) {
    throw createError({ statusCode: 404, statusMessage: 'Song not found' })
  }

  return song
})
