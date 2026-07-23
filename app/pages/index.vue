<script setup lang="ts">
import type { Setlist, Song } from '~~/shared/types/domain'

const { data: songs } = await useFetch<Song[]>('/api/songs')
const { data: setlists } = await useFetch<Setlist[]>('/api/setlists')

const songCount = computed(() => songs.value?.length ?? 0)
const setlistCount = computed(() => setlists.value?.length ?? 0)
const resourceCount = computed(() => songs.value?.reduce((sum, song) => sum + song.resources.length, 0) ?? 0)
const translationRate = computed(() => {
  const allSongs = songs.value ?? []
  if (!allSongs.length) return 0
  const translated = allSongs.filter(song => Object.keys(song.titles).length >= 2).length
  return Math.round((translated / allSongs.length) * 100)
})
const languageCoverage = computed(() => {
  const allSongs = songs.value ?? []
  return [
    { code: 'JA', label: '日本語', count: allSongs.filter(song => song.titles.ja).length, color: '#da5f3f' },
    { code: 'KO', label: '한국어', count: allSongs.filter(song => song.titles.ko).length, color: '#5276d8' },
    { code: 'EN', label: 'English', count: allSongs.filter(song => song.titles.en).length, color: '#3b9b6b' },
    { code: 'ZH', label: '中文', count: allSongs.filter(song => song.titles.zh).length, color: '#b779c5' },
  ]
})
const maxCoverage = computed(() => Math.max(songCount.value, 1))
const nextSetlist = computed(() => [...(setlists.value ?? [])].sort((a, b) => b.date.localeCompare(a.date))[0])
const songMap = computed(() => Object.fromEntries((songs.value ?? []).map(song => [song.id, song])))

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ja-JP', { month: 'short', day: 'numeric', weekday: 'short' }).format(new Date(`${value}T00:00:00`))
}
</script>

<template>
  <div class="dashboard">
    <header class="page-heading">
      <div>
        <p class="eyebrow">Overview</p>
        <h1>おかえりなさい</h1>
        <p>礼拝準備に必要な曲と資料を、ここから整理できます。</p>
      </div>
      <div class="actions">
        <NuxtLink class="ghost-button" to="/setlists/new">
          <span aria-hidden="true">＋</span> セットリストを作成
        </NuxtLink>
        <NuxtLink class="button" to="/songs/new">
          <span aria-hidden="true">＋</span> 新しい曲を登録
        </NuxtLink>
      </div>
    </header>

    <section class="metric-grid">
      <article class="metric-card">
        <div class="metric-icon coral">♪</div>
        <div><span>登録曲</span><strong>{{ songCount }}</strong></div>
        <small>曲ライブラリ</small>
      </article>
      <article class="metric-card">
        <div class="metric-icon blue">≡</div>
        <div><span>セットリスト</span><strong>{{ setlistCount }}</strong></div>
        <small>保存済み</small>
      </article>
      <article class="metric-card">
        <div class="metric-icon green">↗</div>
        <div><span>資料リンク</span><strong>{{ resourceCount }}</strong></div>
        <small>楽譜・スライド</small>
      </article>
      <article class="metric-card">
        <div class="metric-icon purple">文</div>
        <div><span>多言語対応</span><strong>{{ translationRate }}%</strong></div>
        <small>2言語以上</small>
      </article>
    </section>

    <section class="dashboard-grid">
      <article class="panel recent-panel">
        <div class="panel-header">
          <div><h2>最近更新した曲</h2><p>編集を続ける曲をすぐに開けます。</p></div>
          <NuxtLink class="text-link" to="/songs">すべて表示 →</NuxtLink>
        </div>
        <div v-if="songs?.length" class="song-list">
          <NuxtLink v-for="song in songs.slice(0, 4)" :key="song.id" :to="`/songs/${song.id}`" class="song-row">
            <span class="cover" :class="`cover-${song.primaryLanguage || 'ja'}`">{{ song.displayTitle.slice(0, 1) }}</span>
            <span class="song-copy">
              <strong>{{ song.displayTitle }}</strong>
              <small>{{ song.writers || song.composers || '作者未設定' }}</small>
            </span>
            <span class="language-pills">
              <i v-if="song.titles.ja">JA</i><i v-if="song.titles.ko">KO</i><i v-if="song.titles.en">EN</i><i v-if="song.titles.zh">ZH</i>
            </span>
            <span class="resource-count">{{ song.resources.length }} 資料</span>
            <span class="chevron">›</span>
          </NuxtLink>
        </div>
      </article>

      <article class="panel next-panel">
        <div class="panel-header"><div><h2>次のセットリスト</h2><p>直近の準備内容</p></div></div>
        <template v-if="nextSetlist">
          <div class="date-block">
            <span class="calendar-icon">▣</span>
            <span><small>{{ formatDate(nextSetlist.date) }}</small><strong>{{ nextSetlist.name }}</strong></span>
          </div>
          <ol class="setlist-preview">
            <li v-for="(item, index) in [...nextSetlist.items].sort((a, b) => a.order - b.order)" :key="item.id">
              <span>{{ index + 1 }}</span>
              <div><strong>{{ songMap[item.songId]?.displayTitle || '曲を選択' }}</strong><small>{{ item.displayPreset.replaceAll('_', ' · ').toUpperCase() }} · Key {{ item.overrideKey || '—' }}</small></div>
            </li>
          </ol>
          <NuxtLink class="wide-button" :to="`/setlists/${nextSetlist.id}`">セットリストを開く</NuxtLink>
        </template>
        <div v-else class="empty-state">セットリストはまだありません。</div>
      </article>

      <article class="panel coverage-panel">
        <div class="panel-header"><div><h2>言語カバレッジ</h2><p>タイトル登録済みの曲数</p></div></div>
        <div class="coverage-list">
          <div v-for="language in languageCoverage" :key="language.code" class="coverage-row">
            <span class="language-code" :style="{ color: language.color, background: `${language.color}14` }">{{ language.code }}</span>
            <span class="coverage-name">{{ language.label }}</span>
            <span class="bar"><i :style="{ width: `${(language.count / maxCoverage) * 100}%`, background: language.color }" /></span>
            <strong>{{ language.count }}</strong>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.dashboard { display: grid; gap: 24px; }
.page-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; }
.page-heading h1 { margin: 0; font-size: clamp(1.8rem, 4vw, 2.35rem); letter-spacing: -.045em; }
.page-heading > div > p:last-child { margin: 9px 0 0; color: var(--muted); font-size: .92rem; }
.metric-card { display: grid; grid-template-columns: auto 1fr; gap: 5px 14px; align-items: center; }
.metric-card > div:nth-child(2) { display: grid; grid-template-columns: 1fr auto; align-items: baseline; gap: 8px; }
.metric-card span { color: var(--muted); font-size: .78rem; font-weight: 600; }
.metric-card strong { margin: 0; font-size: 1.65rem; }
.metric-card small { grid-column: 2; color: #a0a5aa; font-size: .68rem; }
.metric-icon { width: 40px; height: 40px; grid-row: 1 / 3; display: grid; place-items: center; border-radius: 11px; font-size: 1rem; font-weight: 700; }
.metric-icon.coral { color: var(--primary); background: var(--primary-soft); }
.metric-icon.blue { color: var(--blue); background: var(--blue-soft); }
.metric-icon.green { color: var(--success); background: var(--success-soft); }
.metric-icon.purple { color: #9a58ac; background: #f6edf8; }
.dashboard-grid { display: grid; grid-template-columns: minmax(0, 1.65fr) minmax(310px, .75fr); gap: 18px; }
.recent-panel { grid-row: span 2; }
.panel-header h2 { font-size: 1.02rem; }
.text-link { color: var(--primary); font-size: .78rem; font-weight: 600; }
.song-list { display: grid; }
.song-row { display: grid; grid-template-columns: 45px minmax(150px, 1fr) auto 68px 12px; align-items: center; gap: 13px; padding: 14px 0; border-top: 1px solid var(--line); transition: .18s ease; }
.song-row:hover { transform: translateX(2px); }
.cover { width: 43px; height: 43px; display: grid; place-items: center; border-radius: 10px; background: #f0e8e1; color: #855f47; font-weight: 700; }
.cover-en { background: #edf2ff; color: #5276d8; }.cover-ko { background: #eaf6f0; color: #39845d; }.cover-ja { background: #fff0eb; color: #c84e31; }
.song-copy { display: grid; min-width: 0; }
.song-copy strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .87rem; }
.song-copy small { margin-top: 4px; color: var(--muted); font-size: .7rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.language-pills { display: flex; gap: 4px; }
.language-pills i { padding: 3px 5px; border-radius: 4px; background: var(--surface-soft); color: #7d8389; font-size: .58rem; font-style: normal; font-weight: 700; }
.resource-count { color: var(--muted); font-size: .7rem; }
.chevron { color: #b5b9bd; font-size: 1.2rem; }
.date-block { display: flex; gap: 12px; align-items: center; padding: 13px; border-radius: 11px; background: var(--surface-warm); }
.calendar-icon { width: 36px; height: 36px; display: grid; place-items: center; color: var(--primary); background: #fff; border-radius: 9px; }
.date-block > span:last-child { display: grid; }
.date-block small { color: var(--primary); font-size: .67rem; font-weight: 700; }
.date-block strong { margin-top: 2px; font-size: .82rem; }
.setlist-preview { display: grid; gap: 0; margin: 12px 0 16px; padding: 0; list-style: none; }
.setlist-preview li { display: flex; gap: 10px; align-items: center; padding: 9px 2px; border-bottom: 1px solid var(--line); }
.setlist-preview li > span { width: 21px; height: 21px; display: grid; place-items: center; border-radius: 6px; background: var(--surface-soft); color: var(--muted); font-size: .65rem; font-weight: 700; }
.setlist-preview li div { display: grid; }
.setlist-preview strong { font-size: .76rem; }
.setlist-preview small { margin-top: 3px; color: var(--muted); font-size: .6rem; }
.wide-button { width: 100%; display: flex; justify-content: center; padding: 10px; border: 1px solid var(--line); border-radius: 9px; font-size: .75rem; font-weight: 600; }
.wide-button:hover { background: var(--surface-soft); }
.coverage-list { display: grid; gap: 14px; }
.coverage-row { display: grid; grid-template-columns: 34px 58px 1fr 16px; align-items: center; gap: 8px; }
.language-code { padding: 4px; border-radius: 5px; text-align: center; font-size: .58rem; font-weight: 700; }
.coverage-name { color: var(--muted); font-size: .7rem; }
.coverage-row > strong { font-size: .72rem; }
.bar { height: 5px; overflow: hidden; border-radius: 99px; background: #f0f1f3; }
.bar i { display: block; height: 100%; border-radius: inherit; }
@media (max-width: 1020px) { .dashboard-grid { grid-template-columns: 1fr; }.recent-panel { grid-row: auto; } }
@media (max-width: 720px) {
  .page-heading { align-items: flex-start; flex-direction: column; }
  .page-heading .actions, .page-heading .actions > * { width: 100%; }
  .song-row { grid-template-columns: 43px 1fr auto; }
  .language-pills, .resource-count { display: none; }
}
</style>
