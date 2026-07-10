<script setup lang="ts">
import type { Song } from '~~/shared/types/domain'
import SetlistEditor from '../../components/SetlistEditor.vue'
import { createEmptySetlist } from '~~/shared/utils/domain'

const setlist = createEmptySetlist()

const { data: songs } = await useFetch<Song[]>('/api/songs')
</script>

<template>
  <SetlistEditor :initial-setlist="setlist" :songs="songs ?? []" :is-new="true" />
</template>
