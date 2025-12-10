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
        <IconLineMdSunnyFilledLoopToMoonFilledLoopTransition
          v-if="appStore.themeMode === 'light'"
          w-4.5
          h-4.5
        />
        <IconLineMdMoonFilledToSunnyFilledLoopTransition
          v-else-if="appStore.themeMode === 'dark'"
          w-4.5
          h-4.5
        />
        <IconLineMdComputer v-else w-4.5 h-4.5 />
      </NButton>
    </template>
  </NTooltip>
</template>
