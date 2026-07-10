import type { Setlist } from '~~/shared/types/domain'
import { getRouterParam } from 'h3'
import { upsertSetlist } from '../../utils/setlists'

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<Setlist>(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Setlist id is required' })
  }

  if (!body.name.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'name is required',
    })
  }

  await upsertSetlist({ ...body, id })
  return { ok: true }
})
