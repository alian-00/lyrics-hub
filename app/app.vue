<script setup lang="ts">
useHead({
  titleTemplate: title => title ? `${title} — Lyrics Hub` : 'Lyrics Hub',
  meta: [
    {
      name: 'description',
      content: '多言語の賛美歌詞・資料・セットリストを、ひとつの場所で管理するワークスペース',
    },
  ],
})

const route = useRoute()

const navItems = [
  { to: '/', label: 'ホーム', icon: 'home' },
  { to: '/songs', label: '曲ライブラリ', icon: 'music' },
  { to: '/setlists', label: 'セットリスト', icon: 'list' },
]

function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <div class="app-shell">
    <NuxtRouteAnnouncer />
    <aside class="sidebar">
      <NuxtLink to="/" class="brand" aria-label="Lyrics Hub ホーム">
        <span class="brand-mark">
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path d="M9 9.5v12.8a3.2 3.2 0 1 1-2-3V8l14-3v13.3a3.2 3.2 0 1 1-2-3V9.2L9 11.3" />
          </svg>
        </span>
        <span class="brand-copy">
          <strong>Lyrics Hub</strong>
          <small>Worship workspace</small>
        </span>
      </NuxtLink>

      <nav class="sidenav" aria-label="メインナビゲーション">
        <p class="nav-caption">ワークスペース</p>
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="navlink"
          :class="{ active: isActive(item.to) }"
        >
          <svg v-if="item.icon === 'home'" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" />
          </svg>
          <svg v-else-if="item.icon === 'music'" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 18V5l11-2v13M9 9l11-2M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm11-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          </svg>
          <svg v-else viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
          </svg>
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="sidebar-spacer" />
      <div class="workspace-card">
        <span class="avatar">LH</span>
        <span>
          <strong>字幕チーム</strong>
          <small>Shared library</small>
        </span>
        <span class="online-dot" title="同期済み" />
      </div>
    </aside>

    <div class="main-area">
      <header class="mobile-header">
        <NuxtLink to="/" class="brand compact">
          <span class="brand-mark">
            <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M9 9.5v12.8a3.2 3.2 0 1 1-2-3V8l14-3v13.3a3.2 3.2 0 1 1-2-3V9.2L9 11.3" /></svg>
          </span>
          <strong>Lyrics Hub</strong>
        </NuxtLink>
        <nav class="mobile-nav">
          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" :class="{ active: isActive(item.to) }">
            {{ item.label }}
          </NuxtLink>
        </nav>
      </header>
      <main class="page-wrap">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;600;700&display=swap');

:root {
  color-scheme: light;
  --bg: #f5f6f8;
  --surface: #ffffff;
  --surface-soft: #f8f9fb;
  --surface-warm: #fbf8f4;
  --text: #202427;
  --muted: #70777f;
  --primary: #da5f3f;
  --primary-dark: #b9482c;
  --primary-soft: #fff0eb;
  --line: #e6e8eb;
  --success: #3b9b6b;
  --success-soft: #e9f7ef;
  --blue: #5276d8;
  --blue-soft: #edf2ff;
  --shadow: 0 1px 2px rgba(20, 24, 30, 0.03), 0 12px 32px rgba(20, 24, 30, 0.05);
}

* { box-sizing: border-box; }
html, body, #__nuxt { min-height: 100%; margin: 0; }
body {
  font-family: 'DM Sans', 'Noto Sans JP', sans-serif;
  color: var(--text);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
}
a { color: inherit; text-decoration: none; }
button, input, select, textarea { font: inherit; }
button:disabled { cursor: not-allowed; opacity: .5; }

.app-shell { min-height: 100vh; display: grid; grid-template-columns: 248px minmax(0, 1fr); }
.sidebar {
  position: sticky; top: 0; height: 100vh; padding: 28px 20px 20px;
  display: flex; flex-direction: column; background: #fff; border-right: 1px solid var(--line);
}
.brand { display: flex; align-items: center; gap: 11px; padding: 0 8px; }
.brand-mark {
  width: 38px; height: 38px; display: grid; place-items: center; flex: 0 0 auto;
  color: #fff; background: var(--primary); border-radius: 11px; box-shadow: 0 8px 18px rgba(218,95,63,.2);
}
.brand-mark svg { width: 23px; fill: none; stroke: currentColor; stroke-width: 2.1; stroke-linecap: round; stroke-linejoin: round; }
.brand-copy { display: grid; line-height: 1.15; }
.brand-copy strong { font-size: 1.04rem; letter-spacing: -.02em; }
.brand-copy small, .workspace-card small { margin-top: 4px; color: var(--muted); font-size: .7rem; }
.sidenav { margin-top: 44px; display: grid; gap: 7px; }
.nav-caption { margin: 0 12px 7px; color: #a0a5ab; font-size: .68rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
.navlink { display: flex; align-items: center; gap: 12px; padding: 11px 13px; border-radius: 10px; color: #687078; font-size: .9rem; font-weight: 500; transition: .18s ease; }
.navlink:hover { background: var(--surface-soft); color: var(--text); }
.navlink.active { color: var(--primary-dark); background: var(--primary-soft); font-weight: 600; }
.navlink svg { width: 19px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.sidebar-spacer { flex: 1; }
.workspace-card { display: flex; align-items: center; gap: 10px; padding: 12px; border: 1px solid var(--line); border-radius: 13px; font-size: .8rem; }
.workspace-card > span:nth-child(2) { display: grid; min-width: 0; }
.avatar { width: 34px; height: 34px; display: grid; place-items: center; flex: 0 0 auto; border-radius: 10px; color: #fff; background: #363b40; font-size: .7rem; font-weight: 700; }
.online-dot { width: 7px; height: 7px; margin-left: auto; border-radius: 50%; background: var(--success); }
.main-area { min-width: 0; }
.mobile-header { display: none; }
.page-wrap { max-width: 1280px; margin: 0 auto; padding: 42px 48px 64px; }

.page-grid { display: grid; gap: 22px; }
.hero-card, .panel, .metric-card { border: 1px solid var(--line); border-radius: 16px; background: var(--surface); box-shadow: var(--shadow); }
.hero-card { padding: 30px; }
.hero-card h2, .panel h2, .panel h3 { margin-top: 0; letter-spacing: -.025em; }
.eyebrow { margin: 0 0 9px; color: var(--primary); font-size: .7rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
.muted, .panel-header p, .panel > p { color: var(--muted); }
.metric-grid { display: grid; gap: 14px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
.metric-card { padding: 21px; }
.metric-card strong { display: block; margin-bottom: 5px; font-size: 1.75rem; letter-spacing: -.04em; }
.panel { padding: 24px; }
.panel-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
.panel-header h2, .panel-header h3, .panel-header p { margin-bottom: 0; }
.panel-header p { margin-top: 7px; font-size: .88rem; }
.actions, .inline-actions { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
.button, .ghost-button, .danger-button {
  min-height: 40px; display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  border-radius: 10px; padding: 9px 14px; cursor: pointer; font-size: .84rem; font-weight: 600; transition: .18s ease;
}
.button:hover, .ghost-button:hover, .danger-button:hover { transform: translateY(-1px); }
.button { border: 1px solid var(--primary); background: var(--primary); color: #fff; box-shadow: 0 6px 14px rgba(218,95,63,.16); }
.button:hover { background: var(--primary-dark); border-color: var(--primary-dark); }
.ghost-button { border: 1px solid var(--line); background: #fff; color: var(--text); }
.ghost-button:hover { border-color: #cdd1d5; background: var(--surface-soft); }
.danger-button { border: 1px solid #f0d9d3; background: #fff8f6; color: #b64c32; }

.grid-2, .grid-3, .grid-4 { display: grid; gap: 15px; }
.grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.field { display: grid; gap: 7px; }
.field label, .field .label { font-size: .8rem; font-weight: 600; }
.field input, .field select, .field textarea { width: 100%; border: 1px solid #dfe2e5; border-radius: 10px; padding: 11px 12px; background: #fff; color: var(--text); outline: none; transition: .18s ease; }
.field input:focus, .field select:focus, .field textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-soft); }
.field textarea { min-height: 110px; resize: vertical; }
.summary-table, .simple-table { width: 100%; border-collapse: collapse; }
.summary-table th, .summary-table td, .simple-table th, .simple-table td { padding: 13px 10px; border-top: 1px solid var(--line); text-align: left; vertical-align: middle; }
.summary-table th, .simple-table th { color: #90959b; font-size: .72rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
.summary-table td, .simple-table td { font-size: .86rem; }
.summary-table a, .simple-table a { font-weight: 600; }
.chip-row { display: flex; gap: 6px; flex-wrap: wrap; }
.chip { border-radius: 999px; padding: 5px 9px; background: var(--surface-soft); border: 1px solid var(--line); color: #60676e; font-size: .72rem; font-weight: 600; }
.status-dot { display: inline-flex; width: 7px; height: 7px; margin-right: 7px; border-radius: 50%; background: var(--success); }
.editor-stack { display: grid; gap: 17px; }
.card { padding: 17px; border: 1px solid var(--line); border-radius: 13px; background: var(--surface-soft); }
.card-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 13px; flex-wrap: wrap; }
.tabs { display: flex; gap: 6px; flex-wrap: wrap; padding: 5px; border-radius: 11px; background: var(--surface-soft); width: fit-content; }
.tab-button { border: 0; border-radius: 8px; padding: 9px 13px; background: transparent; color: var(--muted); cursor: pointer; font-size: .8rem; font-weight: 600; }
.tab-button.active { background: #fff; color: var(--text); box-shadow: 0 1px 4px rgba(20,24,30,.08); }
.split-layout { display: grid; gap: 22px; grid-template-columns: minmax(0, 1.4fr) minmax(300px, .6fr); align-items: start; }
.export-block { display: grid; gap: 12px; }
.code-block { margin: 0; padding: 16px; border-radius: 11px; background: #25292d; color: #e9edf0; white-space: pre-wrap; overflow: auto; font-family: 'SFMono-Regular', Consolas, monospace; font-size: .78rem; }
.empty-state { padding: 28px; border: 1px dashed #d6d9dd; border-radius: 12px; text-align: center; color: var(--muted); font-size: .88rem; }

@media (max-width: 1020px) {
  .app-shell { grid-template-columns: 210px minmax(0, 1fr); }
  .page-wrap { padding: 32px 28px 48px; }
  .metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .grid-3, .grid-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .split-layout { grid-template-columns: 1fr; }
  .simple-table { display: block; overflow-x: auto; }
}

@media (max-width: 720px) {
  .app-shell { display: block; }
  .sidebar { display: none; }
  .mobile-header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; padding: 14px 18px; background: #fff; border-bottom: 1px solid var(--line); }
  .brand.compact { padding: 0; gap: 8px; }
  .brand.compact .brand-mark { width: 32px; height: 32px; border-radius: 9px; }
  .brand.compact .brand-mark svg { width: 19px; }
  .mobile-nav { width: 100%; display: flex; gap: 5px; overflow-x: auto; }
  .mobile-nav a { flex: 0 0 auto; padding: 7px 10px; border-radius: 8px; color: var(--muted); font-size: .75rem; font-weight: 600; }
  .mobile-nav a.active { color: var(--primary-dark); background: var(--primary-soft); }
  .page-wrap { padding: 24px 16px 40px; }
  .hero-card, .panel { padding: 19px; }
  .metric-grid, .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
  .summary-table, .simple-table { display: block; overflow-x: auto; white-space: nowrap; }
}
</style>
