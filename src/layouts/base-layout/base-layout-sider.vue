<script setup lang="tsx">
import { createGetRoutes, router } from '@/plugins/00.router-plugin';
import type { MenuOption } from 'naive-ui';
import { RouterLink, type RouteRecordRaw } from 'vue-router';
import IconMenuRounded from '~icons/material-symbols/menu-rounded';
import { useAppStore } from '@/stores/app-store';

import zhCN from '@/pages/_page-title-locales/zh-CN';
import enUS from '@/pages/_page-title-locales/en-US';

const { t, te } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  missing: (locale, key) => {
    consola.warn(`菜单翻译缺失: locale=${locale}, key=${key}`);
    return key;
  },
  fallbackRoot: true,
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
});

// 路由转换为菜单树的辅助函数
function convertRoutesToMenuOptions(routes: Readonly<RouteRecordRaw[]>): MenuOption[] {
  const menuMap = new Map<string, MenuOption>();
  const rootMenus: MenuOption[] = [];

  // 过滤和排序路由
  const validRoutes = routes
    .filter((route) => {
      // 过滤掉不需要显示的路由
      if (route.meta?.hideInMenu === true || route.meta?.layout === false) {
        return false;
      }
      // 过滤掉通配符路径
      if (route.path.includes('*')) {
        return false;
      }
      // 根据环境变量判断是否显示 /demos 开头的路由
      if (route.path.startsWith('/demos') && import.meta.env.VITE_MENU_SHOW_DEMOS !== 'true') {
        return false;
      }
      return true;
    })
    .sort((a, b) => a.path.localeCompare(b.path));

  // 构建菜单树
  for (const route of validRoutes) {
    const pathSegments = route.path.split('/').filter(Boolean);
    const routeName = route.name as string;
    const text = te(routeName) ? t(routeName) : route.meta?.title || routeName;

    const menuOption: MenuOption = {
      label: () => (route.meta?.link === false ? text : <RouterLink to={route}>{text}</RouterLink>),
      key: route.path,
      icon: () => <IconMenuRounded style="width: 1em; height: 1em;" />,
    };

    // 如果是根路径或只有一级路径，直接添加到根菜单
    if (pathSegments.length === 0 || pathSegments.length === 1) {
      rootMenus.push(menuOption);
      menuMap.set(route.path, menuOption);
    } else {
      // 多级路径，需要创建或找到父菜单
      let currentPath = '';
      for (let i = 0; i < pathSegments.length - 1; i++) {
        currentPath += `/${pathSegments[i]}`;
      }

      // 将当前菜单项添加到父菜单
      const parentPath = currentPath;
      const parent = menuMap.get(parentPath);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(menuOption);
      } else {
        console.warn(`未找到父菜单项: ${parentPath}，无法将子菜单项添加到其下。`);
      }

      menuMap.set(route.path, menuOption);
    }
  }

  return rootMenus;
}

// 获取路由表但是不包含布局路由
const routes = createGetRoutes(router)();
const menuOptions = computed(() => convertRoutesToMenuOptions(routes));

// console.debug('原始路由:', JSON.stringify(routes, null, 0));
// console.debug('转换后的菜单:', JSON.stringify(menuOptions.value, null, 0));

const menuInstRef = useTemplateRef('menuInstRef');
const selectedKey = ref('');

watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    menuInstRef.value?.showOption(newPath);
    selectedKey.value = newPath;
  },
  { immediate: true },
);

const appStore = useAppStore();
</script>

<template>
  <!-- @update:value="handleMenuUpdate" -->
  <NMenu
    ref="menuInstRef"
    mode="vertical"
    :collapsed="appStore.sidebarCollapsed"
    :collapsed-width="64"
    :icon-size="20"
    :collapsed-icon-size="24"
    v-model:value="selectedKey"
    :options="menuOptions"
    :inverted="false"
    :root-indent="32"
    :indent="32"
  />
</template>
