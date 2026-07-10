export type LanguageCode = 'ja' | 'ko' | 'en' | 'zh'

export type SongTitleSet = Partial<Record<LanguageCode, string>>

export type LanguageDisplayPreset =
  | 'ja_only'
  | 'ko_only'
  | 'ko_ja'
  | 'ja_en'
  | 'ko_ja_en'

export type ResourceType =
  | 'score_pdf'
  | 'chord_pdf'
  | 'lyrics_pdf'
  | 'ppt'
  | 'pptx'
  | 'drive_folder'
  | 'reference'
  | 'youtube'
  | 'other'

export interface SongLine {
  id: string
  order: number
  koOriginal: string
  jaSingable: string
  jaMeaning: string
  enSubtitle: string
  zhSubtitle: string
}

export interface SongSection {
  id: string
  label: string
  order: number
  lines: SongLine[]
}

export interface SongResource {
  id: string
  name: string
  type: ResourceType
  url: string
  key: string
  version: string
  isLatest: boolean
  notes: string
}

export interface Song {
  id: string
  displayTitle: string
  titles: SongTitleSet
  aliases: string[]
  primaryLanguage: LanguageCode | ''
  writers: string
  composers: string
  key: string
  bpm: string
  timeSignature: string
  tags: string[]
  notes: string
  copyrightNote: string
  sections: SongSection[]
  resources: SongResource[]
  updatedAt: string
}

export interface SetlistItem {
  id: string
  songId: string
  order: number
  displayPreset: LanguageDisplayPreset
  overrideKey: string
}

export interface Setlist {
  id: string
  name: string
  date: string
  serviceType: string
  notes: string
  items: SetlistItem[]
  updatedAt: string
}

export interface ExportSlide {
  sectionLabel: string
  lines: string[]
}

export interface SongExportPayload {
  type: 'song'
  songId: string
  songTitle: string
  preset: LanguageDisplayPreset
  generatedAt: string
  slides: ExportSlide[]
}

export interface SetlistExportSong {
  songId: string
  songTitle: string
  preset: LanguageDisplayPreset
  overrideKey: string
  slides: ExportSlide[]
}

export interface SetlistExportPayload {
  type: 'setlist'
  setlistId: string
  setlistName: string
  date: string
  generatedAt: string
  songs: SetlistExportSong[]
}
