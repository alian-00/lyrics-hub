import type {
  LanguageCode,
  LanguageDisplayPreset,
  Setlist,
  SetlistItem,
  Song,
  SongLine,
  SongResource,
  SongSection,
} from '../types/domain'

export const languageOptions: Array<{ code: LanguageCode; label: string }> = [
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '韓国語' },
  { code: 'en', label: '英語' },
  { code: 'zh', label: '中国語' },
]

export const displayPresetOptions: Array<{ value: LanguageDisplayPreset; label: string }> = [
  { value: 'ja_only', label: '日本語のみ' },
  { value: 'ko_only', label: '韓国語のみ' },
  { value: 'ko_ja', label: '韓国語 + 日本語' },
  { value: 'ja_en', label: '日本語 + 英語' },
  { value: 'ko_ja_en', label: '韓国語 + 日本語 + 英語' },
]

export const resourceTypeOptions: Array<{ value: SongResource['type']; label: string }> = [
  { value: 'score_pdf', label: '楽譜 PDF' },
  { value: 'chord_pdf', label: 'コード譜 PDF' },
  { value: 'lyrics_pdf', label: '歌詞 PDF' },
  { value: 'ppt', label: 'PowerPoint' },
  { value: 'pptx', label: 'PowerPoint' },
  { value: 'drive_folder', label: 'Google Drive フォルダ' },
  { value: 'reference', label: '参考資料' },
  { value: 'youtube', label: '参考音源' },
  { value: 'other', label: 'その他' },
]

export function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export function createEmptySongLine(order = 0): SongLine {
  return {
    id: createId('line'),
    order,
    koOriginal: '',
    jaSingable: '',
    jaMeaning: '',
    enSubtitle: '',
    zhSubtitle: '',
  }
}

export function createEmptySongSection(order = 0): SongSection {
  return {
    id: createId('section'),
    label: `Section ${order + 1}`,
    order,
    lines: [createEmptySongLine(0)],
  }
}

export function createEmptyResource(): SongResource {
  return {
    id: createId('resource'),
    name: '',
    type: 'score_pdf',
    url: '',
    key: '',
    version: '',
    isLatest: true,
    notes: '',
  }
}

export function createEmptySong(): Song {
  return {
    id: createId('song'),
    displayTitle: '',
    titles: {},
    aliases: [],
    primaryLanguage: '',
    writers: '',
    composers: '',
    key: '',
    bpm: '',
    timeSignature: '',
    tags: [],
    notes: '',
    copyrightNote: '',
    sections: [createEmptySongSection(0)],
    resources: [createEmptyResource()],
    updatedAt: new Date().toISOString(),
  }
}

export function createEmptySetlistItem(order = 0): SetlistItem {
  return {
    id: createId('setitem'),
    songId: '',
    order,
    displayPreset: 'ja_only',
    overrideKey: '',
  }
}

export function createEmptySetlist(): Setlist {
  return {
    id: createId('setlist'),
    name: '',
    date: new Date().toISOString().slice(0, 10),
    serviceType: '',
    notes: '',
    items: [createEmptySetlistItem(0)],
    updatedAt: new Date().toISOString(),
  }
}

export function normalizeDelimitedList(value: string) {
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

export function formatDelimitedList(values: string[]) {
  return values.join(', ')
}
