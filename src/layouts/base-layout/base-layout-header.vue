<script setup lang="ts">
const buttonRef = useTemplateRef('buttonRef');
const appStore = useAppStore();

function toggleCollapsed() {
  // https://github.com/tusen-ai/naive-ui/issues/3688
  // hover style 鼠标移出就会消失 如果是点击 button 会聚焦需要失去焦点才会恢复
  buttonRef.value?.$el.blur();
  appStore.toggleSidebar();
}

const themeLabels: Record<AppThemeMode, string> = {
  light: '浅色',
  dark: '深色',
  system: '跟随系统',
};

const { locale } = useI18n();
const languageLabels: Record<string, string> = {
  'en-US': 'English',
  'zh-CN': '简体中文',
};
function toggleLanguage() {
  locale.value = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN';
}
</script>

<template>
  <div class="h-full flex items-center justify-between px-12px shadow-header dark:shadow-gray-700">
    <div>
      <NTooltip :disabled="appStore.isMobile" placement="bottom-start">
        {{ appStore.sidebarCollapsed ? '展开菜单' : '收起菜单' }}
        <template #trigger>
          <NButton ref="buttonRef" quaternary @click="toggleCollapsed">
            <icon-line-md:menu-fold-right v-if="appStore.sidebarCollapsed" w-4.5 h-4.5 />
            <icon-line-md:menu-fold-left v-else w-4.5 h-4.5 />
          </NButton>
        </template>
      </NTooltip>
    </div>

    <div class="flex items-center">
      <NTooltip :disabled="appStore.isMobile" placement="bottom-end">
        {{ languageLabels[locale] }}
        <template #trigger>
          <NButton quaternary @click="toggleLanguage">
            <icon-clarity:language-line w-4.5 h-4.5 />
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
  </div>
</template>
