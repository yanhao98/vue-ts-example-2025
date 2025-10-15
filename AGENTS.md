# AGENTS.md

This file provides guidance to AI when working with code in this repository.

## Project Overview

Vue 3 TypeScript application with Vite.

### Routing & Layouts

- **File-based routing**: Uses `unplugin-vue-router` with `.page.vue` and `.page.md` extensions in `src/pages/`
- **Route naming**: Converts to PascalCase (e.g., `user-profile.page.vue` → `UserProfile`)
- **Layouts**: `vite-plugin-vue-meta-layouts` with default layout `base-layout/base-layout`

### Auto-Import Configuration

Multiple auto-import systems are active:

- **Vue APIs**: Core Vue, VueUse, Pinia, Vue Router, vue-i18n
- **Components**: Auto-registered from multiple UI libraries (Naive UI, PrimeVue)
- **Icons**: Uses `unplugin-icons` with `icon-` prefix; custom SVGs from `src/assets/icons/svgs/` available via `icon-svg:filename`

**IMPORTANT - Auto-Import Limitations**:

- Auto-imported components do NOT work with dynamic components (e.g., `<component :is="dynamicName" />`)
- When using icons or components conditionally, use `v-if`/`v-else-if`/`v-else` instead of dynamic component syntax
- Example: Use `<icon-foo v-if="condition" />` instead of `<component :is="`icon-${name}`" />`

### UI Component Libraries

Project has multiple UI frameworks configured:

- **Naive UI**
- **PrimeVue**:

### Styling

- **UnoCSS**: Wind preset
- **SCSS**: Modern compiler API with global imports from `@/styles/scss/global.scss`

### State Management

Pinia stores

### Cloudflare Workers Integration

- **Server entry**: `server/index.ts` handles `/api/*` routes with KV storage
- **KV binding**: Named `KV`

### Vite Plugins (notable)

- **vue-macros**: Enhanced Vue features
- **unplugin-vue-markdown**: `.md` files as Vue components with frontmatter

### Path Aliases

- `@/` maps to `src/` directory
