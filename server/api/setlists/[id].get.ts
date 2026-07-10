import { getRouterParam } from 'h3'
import { getSetlistById } from '../../utils/setlists'

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Setlist id is required' })
  }

  const setlist = await getSetlistById(id)

  if (!setlist) {
    throw createError({ statusCode: 404, statusMessage: 'Setlist not found' })
  }

  return setlist
})
