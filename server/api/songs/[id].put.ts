import type { Song } from '~~/shared/types/domain'
import { getRouterParam } from 'h3'
import { upsertSong } from '../../utils/songs'

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<Song>(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Song id is required' })
  }

  if (!body.displayTitle.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'displayTitle is required',
    })
  }

  await upsertSong({ ...body, id })
  return { ok: true }
})
