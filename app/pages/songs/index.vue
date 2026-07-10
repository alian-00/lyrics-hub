<script setup lang="ts">
import type { Song } from '~~/shared/types/domain'

const search = ref('')
const languageFilter = ref<'all' | 'ja' | 'ko' | 'en' | 'zh'>('all')
const resourceFilter = ref<'all' | 'with_resources' | 'without_resources'>('all')

const { data: songs, refresh } = await useFetch<Song[]>('/api/songs')

const filteredSongs = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return (songs.value ?? []).filter((song) => {
    const haystacks = [
      song.displayTitle,
      ...Object.values(song.titles),
      ...song.aliases,
      ...song.tags,
    ]
      .filter(Boolean)
      .map(value => value.toLowerCase())

    const matchesKeyword = !keyword || haystacks.some(value => value.includes(keyword))
    const matchesLanguage = languageFilter.value === 'all' || Boolean(song.titles[languageFilter.value])
    const matchesResource = resourceFilter.value === 'all'
      || (resourceFilter.value === 'with_resources' ? song.resources.length > 0 : song.resources.length === 0)

    return matchesKeyword && matchesLanguage && matchesResource
  })
})

async function removeSong(id: string) {
  if (!window.confirm('この曲を削除しますか？')) {
    return
  }

  await $fetch(`/api/songs/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <div class="page-grid">
    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Songs</p>
          <h2>曲一覧</h2>
          <p>多言語タイトル・タグ・資料状況をまとめて確認できます。</p>
        </div>
        <div class="actions">
          <NuxtLink class="button" to="/songs/new">新規曲を作成</NuxtLink>
        </div>
      </div>

      <div class="grid-3">
        <div class="field">
          <label for="song-search">検索</label>
          <input id="song-search" v-model="search" placeholder="曲名・別名・タグで検索" />
        </div>
        <div class="field">
          <label for="song-language">タイトル言語</label>
          <select id="song-language" v-model="languageFilter">
            <option value="all">すべて</option>
            <option value="ja">日本語あり</option>
            <option value="ko">韓国語あり</option>
            <option value="en">英語あり</option>
            <option value="zh">中国語あり</option>
          </select>
        </div>
        <div class="field">
          <label for="resource-filter">資料リンク</label>
          <select id="resource-filter" v-model="resourceFilter">
            <option value="all">すべて</option>
            <option value="with_resources">資料あり</option>
            <option value="without_resources">資料なし</option>
          </select>
        </div>
      </div>
    </section>

    <section class="panel">
      <table class="simple-table" v-if="filteredSongs.length">
        <thead>
          <tr>
            <th>曲名</th>
            <th>登録済みタイトル</th>
            <th>主言語</th>
            <th>タグ</th>
            <th>資料</th>
            <th>更新日</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="song in filteredSongs" :key="song.id">
            <td>
              <NuxtLink :to="`/songs/${song.id}`">{{ song.displayTitle }}</NuxtLink>
            </td>
            <td>
              <div class="chip-row">
                <span class="chip" v-if="song.titles.ja">JA</span>
                <span class="chip" v-if="song.titles.ko">KO</span>
                <span class="chip" v-if="song.titles.en">EN</span>
                <span class="chip" v-if="song.titles.zh">ZH</span>
              </div>
            </td>
            <td>{{ song.primaryLanguage || '未設定' }}</td>
            <td>
              <div class="chip-row">
                <span v-for="tag in song.tags" :key="tag" class="chip">{{ tag }}</span>
              </div>
            </td>
            <td>
              <span v-if="song.resources.length"><span class="status-dot" />{{ song.resources.length }}件</span>
              <span v-else class="muted">なし</span>
            </td>
            <td>{{ new Date(song.updatedAt).toLocaleDateString() }}</td>
            <td>
              <div class="inline-actions">
                <NuxtLink class="ghost-button" :to="`/songs/${song.id}`">開く</NuxtLink>
                <button class="danger-button" type="button" @click="removeSong(song.id)">削除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        条件に合う曲がまだありません。
      </div>
    </section>
  </div>
</template>
