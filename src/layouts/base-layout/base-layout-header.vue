<script setup lang="ts">
const collapsed = defineModel<boolean>('collapsed');
const buttonRef = useTemplateRef('buttonRef');
const appStore = useAppStore();
function toggleCollapsed() {
  // https://github.com/tusen-ai/naive-ui/issues/3688
  // hover style 鼠标移出就会消失 如果是点击 button 会聚焦需要失去焦点才会恢复
  buttonRef.value?.$el.blur();
  collapsed.value = !collapsed.value;
}

const themeLabels: Record<AppThemeMode, string> = {
  light: '浅色',
  dark: '深色',
  system: '跟随系统',
};
</script>

<template>
  <div class="h-full flex items-center justify-between px-12px shadow-header dark:shadow-gray-700">
    <NTooltip :disabled="appStore.isMobile" placement="bottom-start">
      {{ collapsed ? '展开菜单' : '收起菜单' }}
      <template #trigger>
        <NButton ref="buttonRef" quaternary @click="toggleCollapsed">
          <icon-line-md:menu-fold-right v-if="collapsed" w-4.5 h-4.5 />
          <icon-line-md:menu-fold-left v-else w-4.5 h-4.5 />
        </NButton>
      </template>
    </NTooltip>

    <NTooltip :disabled="appStore.isMobile" placement="bottom-end">
      {{ themeLabels[appStore.themeMode] }}
      <template #trigger>
        <NButton quaternary @click="appStore.cycleTheme">
          <icon-line-md:sunny-filled-loop-to-moon-filled-loop-transition
            v-if="appStore.themeMode === 'light'"
            w-4.5
            h-4.5
          />
          <icon-line-md:moon-filled-to-sunny-filled-loop-transition
            v-else-if="appStore.themeMode === 'dark'"
            w-4.5
            h-4.5
          />
          <icon-line-md:computer v-else w-4.5 h-4.5 />
        </NButton>
      </template>
    </NTooltip>
  </div>
</template>
