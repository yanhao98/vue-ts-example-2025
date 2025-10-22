<script setup lang="tsx">
import { createGetRoutes, router } from '@/plugins/router-plugin';
import type { MenuOption } from 'naive-ui';
import { RouterLink, type RouteRecordRaw } from 'vue-router';

// 路由转换为菜单树的辅助函数
function convertRoutesToMenuOptions(routes: Readonly<RouteRecordRaw[]>): MenuOption[] {
  const menuMap = new Map<string, MenuOption>();
  const rootMenus: MenuOption[] = [];

  // 过滤和排序路由
  const validRoutes = routes
    .filter((route) => {
      // 过滤掉不需要显示的路由
      if (route.meta?.hidden === true || route.meta?.layout === false) {
        return false;
      }
      // 过滤掉通配符路径
      if (route.path.includes('*')) {
        return false;
      }
      return true;
    })
    .sort((a, b) => a.path.localeCompare(b.path));

  // 构建菜单树
  for (const route of validRoutes) {
    const pathSegments = route.path.split('/').filter(Boolean);
    const menuOption: MenuOption = {
      label: () => (
        <RouterLink to={route}>{route.meta?.title || (route.name as string)}</RouterLink>
      ),
      key: route.path,
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
      }

      menuMap.set(route.path, menuOption);
    }
  }

  return rootMenus;
}

// 获取路由表但是不包含布局路由
const routes = createGetRoutes(router)();
const menuOptions = computed(() => convertRoutesToMenuOptions(routes));

console.debug('原始路由:', JSON.stringify(routes, null, 0));
console.debug('转换后的菜单:', JSON.stringify(menuOptions.value, null, 0));

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
</script>

<template>
  <!-- @update:value="handleMenuUpdate" -->
  <NMenu
    v-model:value="selectedKey"
    ref="menuInstRef"
    :options="menuOptions"
    :root-indent="32"
    :indent="32"
  />
</template>
