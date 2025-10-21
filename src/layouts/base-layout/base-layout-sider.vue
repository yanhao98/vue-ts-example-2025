<script setup lang="ts">
import type { MenuOption } from 'naive-ui';
import type { RouteRecordNormalized } from 'vue-router';
import { createGetRoutes, router } from '@/plugins/router-plugin';

// 路由转换为菜单树的辅助函数
function convertRoutesToMenuOptions(routes: RouteRecordNormalized[]): MenuOption[] {
  const menuMap = new Map<string, MenuOption>();
  const rootMenus: MenuOption[] = [];

  // 过滤和排序路由
  const validRoutes = routes
    .filter((route) => {
      // 过滤掉不需要显示的路由
      if (!route.name || route.meta?.hidden === true || route.meta?.layout === false) {
        return false;
      }
      // 过滤掉根路径和通配符路径
      if (route.path === '/' || route.path.includes('*')) {
        return false;
      }
      return true;
    })
    .sort((a, b) => a.path.localeCompare(b.path));

  // 构建菜单树
  for (const route of validRoutes) {
    const pathSegments = route.path.split('/').filter(Boolean);
    const menuOption: MenuOption = {
      label: route.meta?.title || (route.name as string),
      key: route.path,
    };

    // 如果只有一级路径，直接添加到根菜单
    if (pathSegments.length === 1) {
      rootMenus.push(menuOption);
      menuMap.set(route.path, menuOption);
    } else {
      // 多级路径，需要创建或找到父菜单
      let currentPath = '';
      for (let i = 0; i < pathSegments.length - 1; i++) {
        currentPath += `/${pathSegments[i]}`;

        if (!menuMap.has(currentPath)) {
          // 创建父菜单节点
          const parentMenu: MenuOption = {
            label: pathSegments[i],
            key: currentPath,
            children: [],
          };

          if (i === 0) {
            // 顶级父节点
            rootMenus.push(parentMenu);
          } else {
            // 找到祖父节点并添加
            const grandParentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
            const grandParent = menuMap.get(grandParentPath);
            if (grandParent) {
              if (!grandParent.children) {
                grandParent.children = [];
              }
              grandParent.children.push(parentMenu);
            }
          }

          menuMap.set(currentPath, parentMenu);
        }
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

const routes = createGetRoutes(router)();
const menuOptions = computed(() => convertRoutesToMenuOptions(routes));

console.debug('原始路由:', JSON.stringify(routes, null, 2));
console.debug('转换后的菜单:', JSON.stringify(menuOptions.value, null, 2));

// 处理菜单点击，导航到对应路由
const handleMenuUpdate = (key: string) => {
  // 只有当 key 对应一个实际路由时才导航
  const route = routes.find((r) => r.path === key);
  if (route && !route.children?.length) {
    router.push(key);
  }
};
</script>

<template>
  <NMenu :options="menuOptions" @update:value="handleMenuUpdate" />
</template>
