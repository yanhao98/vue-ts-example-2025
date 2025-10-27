# AGENTS.md

This file provides guidance to AI when working with code in this repository.

## Project Overview

Vue 3 TypeScript application with Vite.

## 开发服务器

- **不要启动开发服务器**: 开发服务器通常已经由用户启动。除非特别要求，否则不要执行 `pnpm dev` 之类的命令。

### Routing & Layouts

- **File-based routing**: Uses `unplugin-vue-router` with `.page.vue` and `.page.md` extensions in `src/pages/`
- **Route naming**: Converts to PascalCase (e.g., `user-profile.page.vue` → `UserProfile`)
- **Layouts**: `vite-plugin-vue-meta-layouts` with default layout `base-layout/base-layout`

### Auto-Import Configuration

Multiple auto-import systems are active:

- **Vue APIs**: Core Vue, VueUse, Pinia, Vue Router, vue-i18n
- **Components**: Auto-registered from multiple UI libraries (Naive UI, PrimeVue)
- **Icons**: Uses `unplugin-icons` with `icon-` prefix; custom SVGs from `src/assets/icons/svgs/` available via `icon-svg-filename`

**IMPORTANT - Auto-Import Limitations**:

- **Dynamic components**: Auto-imported components cannot be used with `<component :is="..." />` syntax
  - ❌ Avoid: `<component :is="`icon-${name}`" />`
  - ✅ Use: `<icon-foo v-if="condition" />` with `v-if`/`v-else-if`/`v-else` directives

- **Icons in TypeScript/TSX files**: Auto-import for icons does NOT work. You must explicitly import them using the `~icons/` prefix:

  ```tsx
  import IconMenuRounded from '~icons/material-symbols/menu-rounded';

  // Then use in JSX/TSX
  const menuOption = {
    icon: () => <IconMenuRounded />,
  };
  ```

### UI Component Libraries

Project has multiple UI frameworks configured:

- **Naive UI**
  - **Form Layout**: When using `NGrid` for form layouts, prefer `NFormItemGi` over nesting `NFormItem` inside `NGridItem` for more concise code.

    ```vue
    <!-- ❌ Avoid: Verbose nesting -->
    <NGrid :cols="4">
      <NGridItem>
        <NFormItem label="Username">
          <NInput />
        </NFormItem>
      </NGridItem>
    </NGrid>

    <!-- ✅ Use: Concise and direct -->
    <NGrid :cols="4">
      <NFormItemGi label="Username">
        <NInput />
      </NFormItemGi>
    </NGrid>
    ```

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
