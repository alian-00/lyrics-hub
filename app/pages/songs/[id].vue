<script setup lang="ts">
import type { Song } from '~~/shared/types/domain'
import SongEditor from '../../components/SongEditor.vue'

const route = useRoute()
const id = computed(() => route.params.id as string)

const { data: song, error } = await useFetch<Song>(() => `/api/songs/${id.value}`)
</script>

<template>
  <div v-if="error" class="panel">
    <h2>曲が見つかりません</h2>
    <p class="muted">一覧から別の曲を開いてください。</p>
  </div>
  <SongEditor v-else-if="song" :initial-song="song" :is-new="false" />
</template>
