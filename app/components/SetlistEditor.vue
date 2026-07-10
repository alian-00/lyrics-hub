<script setup lang="ts">
import type { Setlist, SetlistItem, Song } from '~~/shared/types/domain'
import { createEmptySetlistItem, displayPresetOptions } from '~~/shared/utils/domain'

const props = defineProps<{
  initialSetlist: Setlist
  songs: Song[]
  isNew: boolean
}>()

const router = useRouter()
const setlist = ref<Setlist>(structuredClone(props.initialSetlist))
const saveMessage = ref('')
const exportPreview = ref<{ json: unknown; text: string } | null>(null)
const isSaving = ref(false)

watch(
  () => props.initialSetlist,
  (value) => {
    setlist.value = structuredClone(value)
  },
  { immediate: true },
)

const songsById = computed(() => Object.fromEntries(props.songs.map(song => [song.id, song])))

function reorderItems() {
  setlist.value.items = setlist.value.items.map((item, index) => ({
    ...item,
    order: index,
  }))
}

function moveItem(index: number, direction: -1 | 1) {
  const nextIndex = index + direction
  if (nextIndex < 0 || nextIndex >= setlist.value.items.length) {
    return
  }

  const clone = [...setlist.value.items]
  const [item] = clone.splice(index, 1)
  clone.splice(nextIndex, 0, item)
  setlist.value.items = clone
  reorderItems()
}

function addItem() {
  setlist.value.items.push(createEmptySetlistItem(setlist.value.items.length))
  reorderItems()
}

function removeItem(index: number) {
  setlist.value.items.splice(index, 1)
  if (setlist.value.items.length === 0) {
    setlist.value.items.push(createEmptySetlistItem(0))
  }
  reorderItems()
}

function normalizePayload() {
  reorderItems()
  return {
    ...setlist.value,
    name: setlist.value.name.trim(),
    serviceType: setlist.value.serviceType.trim(),
    notes: setlist.value.notes.trim(),
    items: setlist.value.items.filter((item: SetlistItem) => item.songId),
  }
}

async function saveSetlist() {
  isSaving.value = true
  saveMessage.value = ''

  try {
    const payload = normalizePayload()
    const method = props.isNew ? 'POST' : 'PUT'
    const path = props.isNew ? '/api/setlists' : `/api/setlists/${payload.id}`
    await $fetch(path, { method, body: payload })
    saveMessage.value = '保存しました。'

    if (props.isNew) {
      await router.push(`/setlists/${payload.id}`)
      return
    }

    setlist.value = payload
  }
  finally {
    isSaving.value = false
  }
}

async function deleteSetlist() {
  if (props.isNew) {
    await router.push('/setlists')
    return
  }

  if (!window.confirm('このセットリストを削除しますか？')) {
    return
  }

  await $fetch(`/api/setlists/${setlist.value.id}`, { method: 'DELETE' })
  await router.push('/setlists')
}

async function refreshExport() {
  exportPreview.value = await $fetch(`/api/exports/setlist/${setlist.value.id}`)
}

function download(kind: 'text' | 'json') {
  if (!exportPreview.value) {
    return
  }

  const fileName = `${setlist.value.name || 'setlist-export'}.${kind === 'text' ? 'txt' : 'json'}`
  const content = kind === 'text'
    ? exportPreview.value.text
    : JSON.stringify(exportPreview.value.json, null, 2)
  const type = kind === 'text' ? 'text/plain;charset=utf-8' : 'application/json'
  const blob = new Blob([content], { type })
  const href = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = href
  link.download = fileName
  link.click()
  URL.revokeObjectURL(href)
}
</script>

<template>
  <div class="page-grid">
    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Setlist Detail</p>
          <h2>{{ isNew ? '新しいセットリスト' : setlist.name || 'セットリストを編集' }}</h2>
          <p>礼拝日、曲順、表示プリセット、キーをまとめて管理します。</p>
        </div>
        <div class="actions">
          <button class="button" type="button" :disabled="isSaving" @click="saveSetlist">
            {{ isSaving ? '保存中...' : '保存する' }}
          </button>
          <button class="ghost-button" type="button" @click="deleteSetlist">
            {{ isNew ? '一覧へ戻る' : '削除する' }}
          </button>
        </div>
      </div>

      <p v-if="saveMessage" class="muted">{{ saveMessage }}</p>

      <div class="grid-2">
        <div class="field">
          <label for="setlist-name">セットリスト名</label>
          <input id="setlist-name" v-model="setlist.name" />
        </div>
        <div class="field">
          <label for="setlist-date">日付</label>
          <input id="setlist-date" v-model="setlist.date" type="date" />
        </div>
        <div class="field">
          <label for="service-type">礼拝種別</label>
          <input id="service-type" v-model="setlist.serviceType" placeholder="主日礼拝 / 青年礼拝" />
        </div>
      </div>

      <div class="field">
        <label for="setlist-notes">備考</label>
        <textarea id="setlist-notes" v-model="setlist.notes" />
      </div>
    </section>

    <section class="split-layout">
      <article class="panel editor-stack">
        <div class="panel-header">
          <div>
            <h3>曲順</h3>
            <p>曲ごとに言語プリセットと使用キーを指定します。</p>
          </div>
          <button class="button" type="button" @click="addItem">曲を追加</button>
        </div>

        <article v-for="(item, index) in setlist.items" :key="item.id" class="card">
          <div class="card-header">
            <strong>{{ index + 1 }} 曲目</strong>
            <div class="inline-actions">
              <button class="ghost-button" type="button" @click="moveItem(index, -1)">↑</button>
              <button class="ghost-button" type="button" @click="moveItem(index, 1)">↓</button>
              <button class="danger-button" type="button" @click="removeItem(index)">削除</button>
            </div>
          </div>

          <div class="grid-3">
            <div class="field">
              <label>曲</label>
              <select v-model="item.songId">
                <option value="">曲を選択</option>
                <option v-for="song in songs" :key="song.id" :value="song.id">
                  {{ song.displayTitle }}
                </option>
              </select>
            </div>
            <div class="field">
              <label>表示プリセット</label>
              <select v-model="item.displayPreset">
                <option v-for="option in displayPresetOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
            <div class="field">
              <label>使用キー</label>
              <input v-model="item.overrideKey" placeholder="必要なら変更" />
            </div>
          </div>

          <div class="chip-row" v-if="songsById[item.songId]">
            <span class="chip">主表示: {{ songsById[item.songId].displayTitle }}</span>
            <span class="chip">曲の標準キー: {{ songsById[item.songId].key || '未設定' }}</span>
          </div>
        </article>
      </article>

      <aside class="panel export-block">
        <h3>セット出力</h3>
        <p class="muted">保存後にセットリスト順の TXT / JSON を確認できます。</p>
        <div class="actions">
          <button class="button" type="button" :disabled="isNew" @click="refreshExport">プレビュー生成</button>
          <button class="ghost-button" type="button" :disabled="!exportPreview" @click="download('json')">JSON 保存</button>
          <button class="ghost-button" type="button" :disabled="!exportPreview" @click="download('text')">TXT 保存</button>
        </div>
        <div v-if="isNew" class="empty-state">
          まずセットリストを保存すると、出力プレビューを確認できます。
        </div>
        <div v-else-if="exportPreview" class="editor-stack">
          <pre class="code-block">{{ exportPreview.text }}</pre>
          <pre class="code-block">{{ JSON.stringify(exportPreview.json, null, 2) }}</pre>
        </div>
      </aside>
    </section>
  </div>
</template>
