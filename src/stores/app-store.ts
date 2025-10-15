import { useMediaQuery, usePreferredColorScheme } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, watch } from 'vue';

export const APP_THEME_MODES = ['light', 'dark', 'system'] as const;
export type AppThemeMode = (typeof APP_THEME_MODES)[number];

const DARK_CLASS = 'app-dark';

export const useAppStore = defineStore('app', () => {
  const themeMode = useLocalStorage<AppThemeMode>('app-theme-mode', 'system');
  const preferredColor = usePreferredColorScheme();

  // 计算实际使用的主题
  const actualTheme = computed(() =>
    themeMode.value === 'system'
      ? preferredColor.value === 'dark'
        ? 'dark'
        : 'light'
      : themeMode.value,
  );

  // 是否是暗色主题
  const isDark = computed(() => actualTheme.value === 'dark');

  // 是否是移动端
  const isMobile = useMediaQuery('(max-width: 768px)');

  // 更新 DOM 类名
  function updateDomClass() {
    document.documentElement.classList.toggle(DARK_CLASS, isDark.value);
  }

  // 设置主题
  function setTheme(mode: AppThemeMode) {
    themeMode.value = mode;
  }

  // 循环切换主题
  function cycleTheme() {
    const currentIndex = APP_THEME_MODES.indexOf(themeMode.value);
    const nextIndex = (currentIndex + 1) % APP_THEME_MODES.length;
    setTheme(APP_THEME_MODES[nextIndex]!);
  }

  // 监听主题变化，更新 DOM
  watch(isDark, updateDomClass, { immediate: true });

  return {
    themeMode,
    actualTheme,
    isDark,
    isMobile,
    setTheme,
    cycleTheme,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot));
}
