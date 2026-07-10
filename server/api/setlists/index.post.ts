import type { Setlist } from '~~/shared/types/domain'
import { upsertSetlist } from '../../utils/setlists'

export default defineEventHandler(async event => {
  const body = await readBody<Setlist>(event)

  if (!body.name.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'name is required',
    })
  }

  await upsertSetlist(body)
  return body
})
