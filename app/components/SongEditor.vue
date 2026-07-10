<script setup lang="ts">
import type { LanguageDisplayPreset, Song, SongLine } from '~~/shared/types/domain'
import {
  createEmptyResource,
  createEmptySongLine,
  createEmptySongSection,
  displayPresetOptions,
  formatDelimitedList,
  languageOptions,
  normalizeDelimitedList,
  resourceTypeOptions,
} from '~~/shared/utils/domain'

const props = defineProps<{
  initialSong: Song
  isNew: boolean
}>()

const router = useRouter()
const route = useRoute()

const activeTab = ref<'basic' | 'lyrics' | 'resources' | 'export'>('basic')
const aliasesInput = ref('')
const tagsInput = ref('')
const saveMessage = ref('')
const exportPreset = ref<LanguageDisplayPreset>('ja_only')
const exportPreview = ref<{ json: unknown; text: string } | null>(null)
const isSaving = ref(false)

const song = ref<Song>(structuredClone(props.initialSong))

watch(
  () => props.initialSong,
  (value) => {
    song.value = structuredClone(value)
    aliasesInput.value = formatDelimitedList(value.aliases)
    tagsInput.value = formatDelimitedList(value.tags)
  },
  { immediate: true },
)

watch(
  () => route.hash,
  (hash) => {
    if (hash === '#lyrics') activeTab.value = 'lyrics'
    if (hash === '#resources') activeTab.value = 'resources'
    if (hash === '#export') activeTab.value = 'export'
  },
  { immediate: true },
)

const registeredLanguages = computed(() => languageOptions.filter(option => song.value.titles[option.code]))

function ensureOrdering() {
  song.value.sections = song.value.sections.map((section, sectionIndex) => ({
    ...section,
    order: sectionIndex,
    lines: section.lines.map((line, lineIndex) => ({
      ...line,
      order: lineIndex,
    })),
  }))
  song.value.resources = song.value.resources.map(resource => ({ ...resource }))
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const nextIndex = index + direction
  if (nextIndex < 0 || nextIndex >= items.length) {
    return
  }

  const clone = [...items]
  const [item] = clone.splice(index, 1)
  clone.splice(nextIndex, 0, item)
  return clone
}

function addSection() {
  song.value.sections.push(createEmptySongSection(song.value.sections.length))
  ensureOrdering()
}

function removeSection(index: number) {
  song.value.sections.splice(index, 1)
  if (song.value.sections.length === 0) {
    song.value.sections.push(createEmptySongSection(0))
  }
  ensureOrdering()
}

function moveSection(index: number, direction: -1 | 1) {
  const moved = moveItem(song.value.sections, index, direction)
  if (moved) {
    song.value.sections = moved
    ensureOrdering()
  }
}

function addLine(sectionIndex: number) {
  song.value.sections[sectionIndex].lines.push(createEmptySongLine(song.value.sections[sectionIndex].lines.length))
  ensureOrdering()
}

function removeLine(sectionIndex: number, lineIndex: number) {
  song.value.sections[sectionIndex].lines.splice(lineIndex, 1)
  if (song.value.sections[sectionIndex].lines.length === 0) {
    song.value.sections[sectionIndex].lines.push(createEmptySongLine(0))
  }
  ensureOrdering()
}

function moveLine(sectionIndex: number, lineIndex: number, direction: -1 | 1) {
  const moved = moveItem(song.value.sections[sectionIndex].lines, lineIndex, direction)
  if (moved) {
    song.value.sections[sectionIndex].lines = moved
    ensureOrdering()
  }
}

function addResource() {
  song.value.resources.push(createEmptyResource())
}

function removeResource(index: number) {
  song.value.resources.splice(index, 1)
  if (song.value.resources.length === 0) {
    song.value.resources.push(createEmptyResource())
  }
}

function normalizeSongPayload() {
  ensureOrdering()

  const sections = song.value.sections.map(section => ({
    ...section,
    lines: section.lines.filter((line: SongLine) =>
      [line.koOriginal, line.jaSingable, line.jaMeaning, line.enSubtitle, line.zhSubtitle]
        .some(value => value.trim()),
    ),
  }))

  return {
    ...song.value,
    aliases: normalizeDelimitedList(aliasesInput.value),
    tags: normalizeDelimitedList(tagsInput.value),
    displayTitle: song.value.displayTitle.trim(),
    titles: Object.fromEntries(
      Object.entries(song.value.titles)
        .map(([key, value]) => [key, value?.trim() ?? ''])
        .filter(([, value]) => value),
    ),
    sections: sections.map((section, index) => ({
      ...section,
      order: index,
      lines: section.lines.length ? section.lines : [createEmptySongLine(0)],
    })),
    resources: song.value.resources.filter(resource => resource.name.trim() || resource.url.trim()),
  }
}

async function saveSong() {
  isSaving.value = true
  saveMessage.value = ''

  try {
    const payload = normalizeSongPayload()
    const method = props.isNew ? 'POST' : 'PUT'
    const path = props.isNew ? '/api/songs' : `/api/songs/${payload.id}`
    await $fetch(path, { method, body: payload })
    saveMessage.value = '保存しました。'

    if (props.isNew) {
      await router.push(`/songs/${payload.id}`)
      return
    }

    song.value = payload
    aliasesInput.value = formatDelimitedList(payload.aliases)
    tagsInput.value = formatDelimitedList(payload.tags)
  }
  finally {
    isSaving.value = false
  }
}

async function deleteSong() {
  if (props.isNew) {
    await router.push('/songs')
    return
  }

  if (!window.confirm('この曲を削除しますか？')) {
    return
  }

  await $fetch(`/api/songs/${song.value.id}`, { method: 'DELETE' })
  await router.push('/songs')
}

async function refreshExport() {
  const response = await $fetch<{ json: unknown; text: string }>(
    `/api/exports/song/${song.value.id}`,
    { query: { preset: exportPreset.value } },
  )
  exportPreview.value = response
}

function downloadText() {
  if (!exportPreview.value) {
    return
  }

  const blob = new Blob([exportPreview.value.text], { type: 'text/plain;charset=utf-8' })
  const href = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = href
  link.download = `${song.value.displayTitle || 'song-export'}.txt`
  link.click()
  URL.revokeObjectURL(href)
}

function downloadJson() {
  if (!exportPreview.value) {
    return
  }

  const blob = new Blob([JSON.stringify(exportPreview.value.json, null, 2)], { type: 'application/json' })
  const href = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = href
  link.download = `${song.value.displayTitle || 'song-export'}.json`
  link.click()
  URL.revokeObjectURL(href)
}
</script>

<template>
  <div class="page-grid">
    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Song Detail</p>
          <h2>{{ isNew ? '新しい曲を登録' : song.displayTitle || '曲を編集' }}</h2>
          <p>多言語タイトル、歌詞、資料、出力を1か所で管理します。</p>
        </div>
        <div class="actions">
          <button class="button" type="button" :disabled="isSaving" @click="saveSong">
            {{ isSaving ? '保存中...' : '保存する' }}
          </button>
          <button class="ghost-button" type="button" @click="deleteSong">
            {{ isNew ? '一覧へ戻る' : '削除する' }}
          </button>
        </div>
      </div>

      <div class="tabs">
        <button class="tab-button" :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">基本情報</button>
        <button class="tab-button" :class="{ active: activeTab === 'lyrics' }" @click="activeTab = 'lyrics'">歌詞</button>
        <button class="tab-button" :class="{ active: activeTab === 'resources' }" @click="activeTab = 'resources'">資料リンク</button>
        <button class="tab-button" :class="{ active: activeTab === 'export' }" @click="activeTab = 'export'">出力</button>
      </div>
      <p v-if="saveMessage" class="muted">{{ saveMessage }}</p>
    </section>

    <section v-if="activeTab === 'basic'" class="split-layout">
      <article class="panel editor-stack">
        <div class="grid-2">
          <div class="field">
            <label for="display-title">主表示タイトル</label>
            <input id="display-title" v-model="song.displayTitle" placeholder="一覧やセットリストで見せるタイトル" />
          </div>
          <div class="field">
            <label for="primary-language">主言語</label>
            <select id="primary-language" v-model="song.primaryLanguage">
              <option value="">未設定</option>
              <option v-for="option in languageOptions" :key="option.code" :value="option.code">{{ option.label }}</option>
            </select>
          </div>
        </div>

        <div class="grid-2">
          <div class="field">
            <label for="title-ja">日本語タイトル</label>
            <input id="title-ja" v-model="song.titles.ja" />
          </div>
          <div class="field">
            <label for="title-ko">韓国語タイトル</label>
            <input id="title-ko" v-model="song.titles.ko" />
          </div>
          <div class="field">
            <label for="title-en">英語タイトル</label>
            <input id="title-en" v-model="song.titles.en" />
          </div>
          <div class="field">
            <label for="title-zh">中国語タイトル</label>
            <input id="title-zh" v-model="song.titles.zh" />
          </div>
        </div>

        <div class="grid-2">
          <div class="field">
            <label for="aliases">別名・略称</label>
            <input id="aliases" v-model="aliasesInput" placeholder="カンマ区切り" />
          </div>
          <div class="field">
            <label for="tags">タグ</label>
            <input id="tags" v-model="tagsInput" placeholder="礼拝, 青年礼拝, よく使う曲" />
          </div>
        </div>

        <div class="grid-3">
          <div class="field">
            <label for="writers">作詞者</label>
            <input id="writers" v-model="song.writers" />
          </div>
          <div class="field">
            <label for="composers">作曲者</label>
            <input id="composers" v-model="song.composers" />
          </div>
          <div class="field">
            <label for="key">キー</label>
            <input id="key" v-model="song.key" />
          </div>
          <div class="field">
            <label for="bpm">BPM</label>
            <input id="bpm" v-model="song.bpm" />
          </div>
          <div class="field">
            <label for="time-signature">拍子</label>
            <input id="time-signature" v-model="song.timeSignature" />
          </div>
        </div>

        <div class="field">
          <label for="notes">備考</label>
          <textarea id="notes" v-model="song.notes" />
        </div>

        <div class="field">
          <label for="copyright-note">著作権メモ</label>
          <textarea id="copyright-note" v-model="song.copyrightNote" />
        </div>
      </article>

      <aside class="panel">
        <h3>登録状況</h3>
        <div class="chip-row">
          <span v-for="option in registeredLanguages" :key="option.code" class="chip">{{ option.label }}</span>
          <span v-if="registeredLanguages.length === 0" class="chip">タイトル未登録</span>
        </div>
        <p class="muted">表示タイトルと多言語タイトルを分けて持たせることで、運用表示と検索対象を整理できます。</p>
      </aside>
    </section>

    <section v-else-if="activeTab === 'lyrics'" class="panel editor-stack">
      <div class="panel-header">
        <div>
          <h3>セクション管理</h3>
          <p>ドラッグ操作は使わず、上下移動で順番を整えます。</p>
        </div>
        <button class="button" type="button" @click="addSection">セクション追加</button>
      </div>

      <article v-for="(section, sectionIndex) in song.sections" :key="section.id" class="card">
        <div class="card-header">
          <div class="field" style="flex: 1 1 220px;">
            <label :for="`section-${section.id}`">セクション名</label>
            <input :id="`section-${section.id}`" v-model="section.label" />
          </div>
          <div class="inline-actions">
            <button class="ghost-button" type="button" @click="moveSection(sectionIndex, -1)">↑</button>
            <button class="ghost-button" type="button" @click="moveSection(sectionIndex, 1)">↓</button>
            <button class="danger-button" type="button" @click="removeSection(sectionIndex)">削除</button>
          </div>
        </div>

        <div class="editor-stack">
          <article v-for="(line, lineIndex) in section.lines" :key="line.id" class="card">
            <div class="card-header">
              <strong>行 {{ lineIndex + 1 }}</strong>
              <div class="inline-actions">
                <button class="ghost-button" type="button" @click="moveLine(sectionIndex, lineIndex, -1)">↑</button>
                <button class="ghost-button" type="button" @click="moveLine(sectionIndex, lineIndex, 1)">↓</button>
                <button class="danger-button" type="button" @click="removeLine(sectionIndex, lineIndex)">削除</button>
              </div>
            </div>

            <div class="grid-2">
              <div class="field">
                <label>韓国語原語</label>
                <textarea v-model="line.koOriginal" />
              </div>
              <div class="field">
                <label>日本語歌唱用</label>
                <textarea v-model="line.jaSingable" />
              </div>
              <div class="field">
                <label>日本語意味確認用</label>
                <textarea v-model="line.jaMeaning" />
              </div>
              <div class="field">
                <label>英語字幕用</label>
                <textarea v-model="line.enSubtitle" />
              </div>
              <div class="field">
                <label>中国語字幕用</label>
                <textarea v-model="line.zhSubtitle" />
              </div>
            </div>
          </article>
        </div>

        <button class="ghost-button" type="button" @click="addLine(sectionIndex)">行を追加</button>
      </article>
    </section>

    <section v-else-if="activeTab === 'resources'" class="panel editor-stack">
      <div class="panel-header">
        <div>
          <h3>資料リンク</h3>
          <p>Google Drive 上の URL を中心に紐づける想定です。</p>
        </div>
        <button class="button" type="button" @click="addResource">資料を追加</button>
      </div>

      <article v-for="(resource, index) in song.resources" :key="resource.id" class="card">
        <div class="card-header">
          <strong>資料 {{ index + 1 }}</strong>
          <button class="danger-button" type="button" @click="removeResource(index)">削除</button>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>資料名</label>
            <input v-model="resource.name" />
          </div>
          <div class="field">
            <label>資料種別</label>
            <select v-model="resource.type">
              <option v-for="option in resourceTypeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="field">
            <label>URL</label>
            <input v-model="resource.url" placeholder="https://..." />
          </div>
          <div class="field">
            <label>キー</label>
            <input v-model="resource.key" />
          </div>
          <div class="field">
            <label>版</label>
            <input v-model="resource.version" />
          </div>
          <div class="field">
            <label>
              <input v-model="resource.isLatest" type="checkbox" style="width: auto; margin-right: 8px;" />
              最新版として扱う
            </label>
          </div>
        </div>
        <div class="field">
          <label>備考</label>
          <textarea v-model="resource.notes" />
        </div>
      </article>
    </section>

    <section v-else class="split-layout">
      <article class="panel export-block">
        <div class="field">
          <label for="preset">表示プリセット</label>
          <select id="preset" v-model="exportPreset">
            <option v-for="option in displayPresetOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="actions">
          <button class="button" type="button" :disabled="isNew" @click="refreshExport">プレビュー生成</button>
          <button class="ghost-button" type="button" :disabled="!exportPreview" @click="downloadJson">JSON 保存</button>
          <button class="ghost-button" type="button" :disabled="!exportPreview" @click="downloadText">TXT 保存</button>
        </div>
        <div v-if="isNew" class="empty-state">
          まず曲を保存すると、出力プレビューを確認できます。
        </div>
      </article>

      <article class="panel export-block">
        <h3>出力プレビュー</h3>
        <div v-if="exportPreview" class="editor-stack">
          <pre class="code-block">{{ exportPreview.text }}</pre>
          <pre class="code-block">{{ JSON.stringify(exportPreview.json, null, 2) }}</pre>
        </div>
        <div v-else class="empty-state">
          プレビューを生成すると、TXT と freeshow-like JSON がここに表示されます。
        </div>
      </article>
    </section>
  </div>
</template>
