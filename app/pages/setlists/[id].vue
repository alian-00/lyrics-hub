<script setup lang="ts">
import type { Setlist, Song } from '~~/shared/types/domain'
import SetlistEditor from '../../components/SetlistEditor.vue'

const route = useRoute()
const id = computed(() => route.params.id as string)

const [{ data: setlist, error }, { data: songs }] = await Promise.all([
  useFetch<Setlist>(() => `/api/setlists/${id.value}`),
  useFetch<Song[]>('/api/songs'),
])
</script>

<template>
  <div v-if="error" class="panel">
    <h2>セットリストが見つかりません</h2>
    <p class="muted">一覧から別のセットリストを開いてください。</p>
  </div>
  <SetlistEditor
    v-else-if="setlist"
    :initial-setlist="setlist"
    :songs="songs ?? []"
    :is-new="false"
  />
</template>
