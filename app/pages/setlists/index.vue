<script setup lang="ts">
import type { Setlist, Song } from '~~/shared/types/domain'

const search = ref('')

const [{ data: setlists, refresh }, { data: songs }] = await Promise.all([
  useFetch<Setlist[]>('/api/setlists'),
  useFetch<Song[]>('/api/songs'),
])

const songMap = computed(() => Object.fromEntries((songs.value ?? []).map(song => [song.id, song])))

const filteredSetlists = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return (setlists.value ?? []).filter((setlist) => {
    if (!keyword) {
      return true
    }

    const itemTitles = setlist.items
      .map(item => songMap.value[item.songId]?.displayTitle ?? '')
      .join(' ')
      .toLowerCase()

    return `${setlist.name} ${setlist.serviceType} ${setlist.notes} ${itemTitles}`.toLowerCase().includes(keyword)
  })
})

async function removeSetlist(id: string) {
  if (!window.confirm('このセットリストを削除しますか？')) {
    return
  }

  await $fetch(`/api/setlists/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <div class="page-grid">
    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Setlists</p>
          <h2>セットリスト一覧</h2>
          <p>礼拝日ごとの曲順と出力プリセットを管理できます。</p>
        </div>
        <NuxtLink class="button" to="/setlists/new">新規セットリスト</NuxtLink>
      </div>

      <div class="field">
        <label for="setlist-search">検索</label>
        <input id="setlist-search" v-model="search" placeholder="礼拝名・曲名・備考で検索" />
      </div>
    </section>

    <section class="panel">
      <table class="simple-table" v-if="filteredSetlists.length">
        <thead>
          <tr>
            <th>セットリスト名</th>
            <th>日付</th>
            <th>礼拝種別</th>
            <th>曲数</th>
            <th>曲名</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="setlist in filteredSetlists" :key="setlist.id">
            <td>
              <NuxtLink :to="`/setlists/${setlist.id}`">{{ setlist.name }}</NuxtLink>
            </td>
            <td>{{ setlist.date }}</td>
            <td>{{ setlist.serviceType || '未設定' }}</td>
            <td>{{ setlist.items.length }}</td>
            <td>
              <div class="chip-row">
                <span
                  v-for="item in [...setlist.items].sort((a, b) => a.order - b.order)"
                  :key="item.id"
                  class="chip"
                >
                  {{ songMap[item.songId]?.displayTitle || '未選択' }}
                </span>
              </div>
            </td>
            <td>
              <div class="inline-actions">
                <NuxtLink class="ghost-button" :to="`/setlists/${setlist.id}`">開く</NuxtLink>
                <button class="danger-button" type="button" @click="removeSetlist(setlist.id)">削除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        条件に合うセットリストがまだありません。
      </div>
    </section>
  </div>
</template>
