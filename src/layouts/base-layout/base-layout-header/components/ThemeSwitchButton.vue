<script setup lang="ts">
const appStore = useAppStore();

const themeLabels: Record<AppThemeMode, string> = {
  light: '浅色',
  dark: '深色',
  auto: '跟随系统',
};
</script>

<template>
  <NTooltip :disabled="appStore.isMobile" placement="bottom-end">
    {{ themeLabels[appStore.themeMode] }}
    <template #trigger>
      <NButton quaternary @click="appStore.cycleTheme()">
        <icon-line-md-sunny-filled-loop-to-moon-filled-loop-transition
          v-if="appStore.themeMode === 'light'"
          w-4.5
          h-4.5
        />
        <icon-line-md-moon-filled-to-sunny-filled-loop-transition
          v-else-if="appStore.themeMode === 'dark'"
          w-4.5
          h-4.5
        />
        <icon-line-md-computer v-else w-4.5 h-4.5 />
      </NButton>
    </template>
  </NTooltip>
</template>
