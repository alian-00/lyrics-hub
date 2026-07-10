<script setup lang="ts">
import SongEditor from '../../components/SongEditor.vue'
import { createEmptySong } from '~~/shared/utils/domain'

const song = createEmptySong()
</script>

<template>
  <SongEditor :initial-song="song" :is-new="true" />
</template>
