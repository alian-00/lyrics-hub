import { getRouterParam } from 'h3'
import { deleteSetlist } from '../../utils/setlists'

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Setlist id is required' })
  }

  await deleteSetlist(id)
  return { ok: true }
})
