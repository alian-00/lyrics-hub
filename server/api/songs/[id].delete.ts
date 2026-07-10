import { getRouterParam } from 'h3'
import { deleteSong } from '../../utils/songs'

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Song id is required' })
  }

  await deleteSong(id)
  return { ok: true }
})
