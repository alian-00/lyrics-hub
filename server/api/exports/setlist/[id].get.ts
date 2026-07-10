import { getRouterParam } from 'h3'
import { buildSetlistExport, buildSetlistExportText } from '../../../utils/exports'
import { getSetlistById } from '../../../utils/setlists'
import { listSongs } from '../../../utils/songs'

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Setlist id is required' })
  }

  const setlist = await getSetlistById(id)

  if (!setlist) {
    throw createError({ statusCode: 404, statusMessage: 'Setlist not found' })
  }

  const songs = await listSongs()
  const payload = buildSetlistExport(setlist, songs)

  return {
    json: payload,
    text: buildSetlistExportText(payload),
  }
})
