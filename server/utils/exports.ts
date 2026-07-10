import type {
  ExportSlide,
  LanguageDisplayPreset,
  Setlist,
  SetlistExportPayload,
  Song,
  SongExportPayload,
  SongLine,
} from '~~/shared/types/domain'

function lineValuesForPreset(line: SongLine, preset: LanguageDisplayPreset) {
  switch (preset) {
    case 'ja_only':
      return [line.jaSingable]
    case 'ko_only':
      return [line.koOriginal]
    case 'ko_ja':
      return [line.koOriginal, line.jaSingable]
    case 'ja_en':
      return [line.jaSingable, line.enSubtitle]
    case 'ko_ja_en':
      return [line.koOriginal, line.jaSingable, line.enSubtitle]
  }
}

function compactLines(values: string[]) {
  return values.map(value => value.trim()).filter(Boolean)
}

export function buildSongSlides(song: Song, preset: LanguageDisplayPreset): ExportSlide[] {
  return song.sections
    .sort((left, right) => left.order - right.order)
    .map(section => ({
      sectionLabel: section.label,
      lines: section.lines
        .sort((left, right) => left.order - right.order)
        .flatMap(line => compactLines(lineValuesForPreset(line, preset))),
    }))
    .filter(slide => slide.lines.length > 0)
}

export function buildSongExport(song: Song, preset: LanguageDisplayPreset): SongExportPayload {
  return {
    type: 'song',
    songId: song.id,
    songTitle: song.displayTitle,
    preset,
    generatedAt: new Date().toISOString(),
    slides: buildSongSlides(song, preset),
  }
}

export function buildSetlistExport(setlist: Setlist, songs: Song[]): SetlistExportPayload {
  return {
    type: 'setlist',
    setlistId: setlist.id,
    setlistName: setlist.name,
    date: setlist.date,
    generatedAt: new Date().toISOString(),
    songs: setlist.items
      .sort((left, right) => left.order - right.order)
      .map(item => {
        const song = songs.find(entry => entry.id === item.songId)
        if (!song) {
          return null
        }

        return {
          songId: song.id,
          songTitle: song.displayTitle,
          preset: item.displayPreset,
          overrideKey: item.overrideKey,
          slides: buildSongSlides(song, item.displayPreset),
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null),
  }
}

export function buildSongExportText(exportPayload: SongExportPayload) {
  return [
    `# ${exportPayload.songTitle}`,
    `Preset: ${exportPayload.preset}`,
    '',
    ...exportPayload.slides.flatMap(slide => [
      `[${slide.sectionLabel}]`,
      ...slide.lines,
      '',
    ]),
  ].join('\n').trim()
}

export function buildSetlistExportText(exportPayload: SetlistExportPayload) {
  return [
    `# ${exportPayload.setlistName}`,
    exportPayload.date,
    '',
    ...exportPayload.songs.flatMap((song, index) => [
      `## ${index + 1}. ${song.songTitle}`,
      `Preset: ${song.preset}`,
      ...(song.overrideKey ? [`Key: ${song.overrideKey}`] : []),
      '',
      ...song.slides.flatMap(slide => [
        `[${slide.sectionLabel}]`,
        ...slide.lines,
        '',
      ]),
    ]),
  ].join('\n').trim()
}
