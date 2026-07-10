import type { Song } from '~~/shared/types/domain'
import { upsertSong } from '../../utils/songs'

export default defineEventHandler(async event => {
  const body = await readBody<Song>(event)

  if (!body.displayTitle.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'displayTitle is required',
    })
  }

  await upsertSong(body)
  return body
})
