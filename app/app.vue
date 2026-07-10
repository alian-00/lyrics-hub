<script setup lang="ts">
useHead({
  title: 'Worship Lyrics Hub',
  meta: [
    {
      name: 'description',
      content: '礼拝準備のための歌詞・資料・セットリストをまとめて管理する MVP',
    },
  ],
})

const route = useRoute()

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/songs', label: 'Songs' },
  { to: '/setlists', label: 'Setlists' },
]
</script>

<template>
  <div class="app-shell">
    <NuxtRouteAnnouncer />
    <header class="topbar">
      <div>
        <p class="eyebrow">Worship Preparation Hub</p>
        <h1>Worship Lyrics Hub</h1>
      </div>
      <nav class="topnav">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="navlink"
          :class="{ active: route.path === item.to || route.path.startsWith(`${item.to}/`) }"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </header>

    <main class="page-wrap">
      <NuxtPage />
    </main>
  </div>
</template>

<style>
:root {
  color-scheme: light;
  --bg: #f7f0e6;
  --bg-accent: #efe2d3;
  --surface: rgba(255, 252, 246, 0.82);
  --surface-strong: #fffaf0;
  --text: #1e1c1a;
  --muted: #695f53;
  --primary: #9d3c22;
  --primary-soft: rgba(157, 60, 34, 0.12);
  --line: rgba(83, 60, 44, 0.18);
  --success: #26643b;
  --shadow: 0 24px 60px rgba(92, 57, 22, 0.12);
}

* {
  box-sizing: border-box;
}

html,
body,
#__nuxt {
  min-height: 100%;
  margin: 0;
}

body {
  font-family: "Avenir Next", "Hiragino Sans", "Noto Sans JP", sans-serif;
  color: var(--text);
  background:
    radial-gradient(circle at top left, rgba(208, 145, 74, 0.16), transparent 28%),
    radial-gradient(circle at top right, rgba(157, 60, 34, 0.1), transparent 24%),
    linear-gradient(180deg, #fbf7f1 0%, var(--bg) 100%);
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
select,
textarea {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  padding: 28px;
}

.topbar {
  max-width: 1320px;
  margin: 0 auto 28px;
  padding: 24px 28px;
  border: 1px solid var(--line);
  border-radius: 28px;
  background:
    linear-gradient(135deg, rgba(255, 251, 244, 0.94), rgba(250, 240, 226, 0.92)),
    var(--surface);
  box-shadow: var(--shadow);
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.topbar h1 {
  margin: 4px 0 0;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1;
}

.eyebrow {
  margin: 0;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.72rem;
  font-weight: 700;
}

.topnav {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.navlink {
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid transparent;
  color: var(--muted);
}

.navlink.active {
  color: var(--primary);
  background: var(--primary-soft);
  border-color: rgba(157, 60, 34, 0.16);
}

.page-wrap {
  max-width: 1320px;
  margin: 0 auto;
}

.page-grid {
  display: grid;
  gap: 20px;
}

.hero-card,
.panel,
.metric-card {
  border: 1px solid var(--line);
  border-radius: 24px;
  background: var(--surface);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow);
}

.hero-card {
  padding: 28px;
}

.hero-card h2,
.panel h2,
.panel h3 {
  margin-top: 0;
}

.metric-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.metric-card {
  padding: 20px;
}

.metric-card strong {
  display: block;
  font-size: 2rem;
  margin-bottom: 6px;
}

.panel {
  padding: 24px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.panel-header p,
.muted {
  color: var(--muted);
}

.actions,
.inline-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.button,
.ghost-button,
.danger-button {
  border: 0;
  border-radius: 14px;
  padding: 11px 16px;
  cursor: pointer;
  transition: transform 0.18s ease, opacity 0.18s ease;
}

.button:hover,
.ghost-button:hover,
.danger-button:hover {
  transform: translateY(-1px);
}

.button {
  background: var(--primary);
  color: white;
}

.ghost-button {
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid var(--line);
  color: var(--text);
}

.danger-button {
  background: rgba(157, 60, 34, 0.12);
  color: var(--primary);
  border: 1px solid rgba(157, 60, 34, 0.16);
}

.grid-2,
.grid-3,
.grid-4 {
  display: grid;
  gap: 16px;
}

.grid-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.grid-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.field {
  display: grid;
  gap: 8px;
}

.field label,
.field .label {
  font-weight: 600;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.85);
}

.field textarea {
  min-height: 110px;
  resize: vertical;
}

.summary-table,
.simple-table {
  width: 100%;
  border-collapse: collapse;
}

.summary-table th,
.summary-table td,
.simple-table th,
.simple-table td {
  text-align: left;
  padding: 14px 10px;
  border-top: 1px solid var(--line);
  vertical-align: top;
}

.summary-table th,
.simple-table th {
  color: var(--muted);
  font-size: 0.9rem;
  font-weight: 600;
}

.chip-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chip {
  border-radius: 999px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid var(--line);
  font-size: 0.86rem;
}

.status-dot {
  display: inline-flex;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--success);
  margin-right: 8px;
}

.editor-stack {
  display: grid;
  gap: 18px;
}

.card {
  border: 1px solid var(--line);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.66);
  padding: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tab-button {
  border-radius: 999px;
  border: 1px solid var(--line);
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.68);
  color: var(--muted);
}

.tab-button.active {
  background: var(--primary-soft);
  color: var(--primary);
  border-color: rgba(157, 60, 34, 0.12);
}

.split-layout {
  display: grid;
  gap: 20px;
  grid-template-columns: 1.3fr 0.7fr;
}

.export-block {
  display: grid;
  gap: 12px;
}

.code-block {
  margin: 0;
  padding: 16px;
  border-radius: 16px;
  background: #1f1a17;
  color: #f7e8d7;
  white-space: pre-wrap;
  overflow: auto;
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 0.88rem;
}

.empty-state {
  padding: 26px;
  border: 1px dashed var(--line);
  border-radius: 18px;
  text-align: center;
  color: var(--muted);
}

@media (max-width: 960px) {
  .grid-2,
  .grid-3,
  .grid-4,
  .split-layout {
    grid-template-columns: 1fr;
  }

  .app-shell {
    padding: 16px;
  }

  .topbar,
  .hero-card,
  .panel {
    padding: 20px;
  }
}
</style>
