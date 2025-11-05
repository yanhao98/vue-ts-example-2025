import { useLocalStorage, useMediaQuery } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed } from 'vue';

// >>>>>
// https://vueuse.org/core/useColorMode/#advanced-usage
const { system, store: themeMode } = useColorMode({
  selector: 'html',
  modes: { light: '', dark: 'app-dark', auto: '' },
  disableTransition: false,
});
const { state, next: cycleTheme } = useCycleList(['light', 'dark', 'auto'] as const, {
  initialValue: themeMode,
});
watchEffect(() => (themeMode.value = state.value));
export type AppThemeMode = typeof themeMode.value;
// <<<<<

export const useAppStore = defineStore('app', () => {
  // 侧边栏展开/收起状态
  const sidebarCollapsed = useLocalStorage<boolean>('app-sidebar-collapsed', false);
  const toggleSidebar = useToggle(sidebarCollapsed);

  // 主题模式
  const actualTheme = computed(() => (themeMode.value === 'auto' ? system.value : themeMode.value));
  const isDark = computed(() => actualTheme.value === 'dark');

  // 是否是移动端
  const isMobile = useMediaQuery('(max-width: 768px)');

  return {
    themeMode,
    isDark,
    isMobile,
    cycleTheme,
    sidebarCollapsed,
    toggleSidebar,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot));
}
