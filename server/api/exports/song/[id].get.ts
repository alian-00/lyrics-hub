import { getQuery, getRouterParam } from 'h3'
import type { LanguageDisplayPreset } from '~~/shared/types/domain'
import { buildSongExport, buildSongExportText } from '../../../utils/exports'
import { getSongById } from '../../../utils/songs'

const fallbackPreset: LanguageDisplayPreset = 'ja_only'

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)
  const preset = (query.preset as LanguageDisplayPreset | undefined) ?? fallbackPreset

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Song id is required' })
  }

  const song = await getSongById(id)

  if (!song) {
    throw createError({ statusCode: 404, statusMessage: 'Song not found' })
  }

  const payload = buildSongExport(song, preset)

  return {
    json: payload,
    text: buildSongExportText(payload),
  }
})
