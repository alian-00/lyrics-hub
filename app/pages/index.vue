<script setup lang="ts">
import type { Setlist, Song } from '~~/shared/types/domain'

const { data: songs } = await useFetch<Song[]>('/api/songs')
const { data: setlists } = await useFetch<Setlist[]>('/api/setlists')

const songCount = computed(() => songs.value?.length ?? 0)
const setlistCount = computed(() => setlists.value?.length ?? 0)
const resourceCount = computed(() => songs.value?.reduce((sum, song) => sum + song.resources.length, 0) ?? 0)
const languageCoverage = computed(() => {
  const allSongs = songs.value ?? []
  return {
    ja: allSongs.filter(song => song.titles.ja).length,
    ko: allSongs.filter(song => song.titles.ko).length,
    en: allSongs.filter(song => song.titles.en).length,
    zh: allSongs.filter(song => song.titles.zh).length,
  }
})
</script>

<template>
  <div class="page-grid">
    <section class="hero-card">
      <p class="eyebrow">MVP Overview</p>
      <h2>礼拝準備の流れをひとつにまとめる</h2>
      <p class="muted">
        曲・多言語タイトル・歌詞・資料リンク・セットリスト・出力確認までを、
        ひとまずローカルで回せる形にまとめた MVP です。
      </p>
      <div class="actions">
        <NuxtLink class="button" to="/songs/new">新しい曲を登録</NuxtLink>
        <NuxtLink class="ghost-button" to="/setlists/new">セットリストを作成</NuxtLink>
      </div>
    </section>

    <section class="metric-grid">
      <article class="metric-card">
        <strong>{{ songCount }}</strong>
        <span>登録済みの曲</span>
      </article>
      <article class="metric-card">
        <strong>{{ setlistCount }}</strong>
        <span>セットリスト</span>
      </article>
      <article class="metric-card">
        <strong>{{ resourceCount }}</strong>
        <span>資料リンク</span>
      </article>
      <article class="metric-card">
        <strong>{{ languageCoverage.ja }}</strong>
        <span>日本語タイトルあり</span>
      </article>
    </section>

    <section class="grid-2">
      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>最近の曲</h2>
            <p>更新日時順に確認できます。</p>
          </div>
          <NuxtLink class="ghost-button" to="/songs">曲一覧へ</NuxtLink>
        </div>
        <table class="summary-table" v-if="songs?.length">
          <thead>
            <tr>
              <th>曲名</th>
              <th>言語</th>
              <th>資料</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="song in songs.slice(0, 5)" :key="song.id">
              <td>
                <NuxtLink :to="`/songs/${song.id}`">{{ song.displayTitle }}</NuxtLink>
              </td>
              <td>{{ song.primaryLanguage || '未設定' }}</td>
              <td>{{ song.resources.length }}件</td>
            </tr>
          </tbody>
        </table>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>最近のセットリスト</h2>
            <p>礼拝日ごとの準備状況を確認できます。</p>
          </div>
          <NuxtLink class="ghost-button" to="/setlists">一覧へ</NuxtLink>
        </div>
        <table class="summary-table" v-if="setlists?.length">
          <thead>
            <tr>
              <th>セットリスト名</th>
              <th>日付</th>
              <th>曲数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="setlist in setlists.slice(0, 5)" :key="setlist.id">
              <td>
                <NuxtLink :to="`/setlists/${setlist.id}`">{{ setlist.name }}</NuxtLink>
              </td>
              <td>{{ setlist.date }}</td>
              <td>{{ setlist.items.length }}曲</td>
            </tr>
          </tbody>
        </table>
      </article>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>タイトル言語カバレッジ</h2>
          <p>複数言語タイトルをどこまで登録できているかをざっくり把握できます。</p>
        </div>
      </div>
      <div class="chip-row">
        <span class="chip">日本語: {{ languageCoverage.ja }}</span>
        <span class="chip">韓国語: {{ languageCoverage.ko }}</span>
        <span class="chip">英語: {{ languageCoverage.en }}</span>
        <span class="chip">中国語: {{ languageCoverage.zh }}</span>
      </div>
    </section>
  </div>
</template>
