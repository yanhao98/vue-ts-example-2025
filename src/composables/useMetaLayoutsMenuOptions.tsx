import type { MenuInst, MenuOption } from 'naive-ui';
import { createGetRoutes } from 'virtual:meta-layouts';
import type { Ref } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { RouterLink } from 'vue-router';
import IconMenuRounded from '~icons/material-symbols/menu-rounded';

export function useMetaLayoutsNMenuOptions({ menuInstRef }: { menuInstRef: Ref<MenuInst | null> }) {
  const router = useRouter();

  const { t, te } = useI18n({
    inheritLocale: true,
    useScope: 'local',
    missing: (locale, key) => {
      consola.warn(`菜单翻译缺失: locale=${locale}, key=${key}`);
      return key;
    },
    fallbackRoot: true,
    messages: locales4RouteMessages,
  });

  // 获取路由表但是不包含布局路由
  const routes = createGetRoutes(router)();

  const options = computed(() => convertRoutesToNMenuOptions(routes));
  const selectedKey = ref('');

  watch(
    () => router.currentRoute.value.path,
    (newPath) => {
      selectedKey.value = newPath;
      menuInstRef.value?.showOption(newPath); // 展开菜单，确保设定的元素被显示，如果不传入 key 会展示当前选中元素
    },
    { immediate: true },
  );

  // 路由转换为菜单树的辅助函数
  function convertRoutesToNMenuOptions(routes: Readonly<RouteRecordRaw[]>): MenuOption[] {
    const orderMaxLength = routes.reduce((max, route) => {
      const order = route.meta?.order;
      if (order !== undefined) {
        const orderLength = String(order).length;
        return orderLength > max ? orderLength : max;
      }
      return max;
    }, 0);

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
        if (import.meta.env.VITE_MENU_SHOW_DEMOS !== 'true' && route.path.startsWith('/demos')) {
          return false;
        }
        return true;
      })
      // 排序路由，确保父路由总是在子路由之前，同级路由则根据 `meta.order` 排序
      .sort((a: RouteRecordRaw, b: RouteRecordRaw) => {
        const pathA = a.path;
        const pathB = b.path;
        const segmentsA = pathA.split('/').filter(Boolean);
        const segmentsB = pathB.split('/').filter(Boolean);
        const parentAPath = `/${segmentsA.slice(0, -1).join('/')}`;
        const parentBPath = `/${segmentsB.slice(0, -1).join('/')}`;

        // 如果不是同级路由，则按路径排序，确保父路由在前
        if (parentAPath !== parentBPath) {
          return pathA.localeCompare(pathB);
        }

        // 同级路由，处理 `meta.order`
        const orderA = a.meta?.order;
        const orderB = b.meta?.order;
        const hasOrderA = orderA !== undefined;
        const hasOrderB = orderB !== undefined;

        // 当一个有 order 而另一个没有时，有 order 的排在前面
        if (hasOrderA !== hasOrderB) {
          return hasOrderA ? -1 : 1;
        }

        // 当两个都有 order 时，按 order 值升序排序
        if (hasOrderA && hasOrderB) {
          const orderDiff = orderA - orderB;
          if (orderDiff !== 0) {
            return orderDiff;
          }
        }

        // order 相同或都没有 order，按路径字母顺序排序
        return pathA.localeCompare(pathB);
      });

    // 构建菜单树
    for (const route of validRoutes) {
      const pathSegments = route.path.split('/').filter(Boolean);
      const routeName = route.name as string;

      let text = te(routeName) ? t(routeName) : route.meta?.title || routeName;
      if (import.meta.env.VITE_MENU_SHOW_ORDER === 'true' && route.meta?.order) {
        const order = String(route.meta.order).padStart(orderMaxLength, '0');
        text = `${order}. ${text}`;
      }

      const menuOption: MenuOption = {
        label: () =>
          route.meta?.link === false ? text : <RouterLink to={route}>{text}</RouterLink>,
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
          consola.warn(`未找到父菜单项: ${parentPath}，无法将子菜单项添加到其下。`);
        }

        menuMap.set(route.path, menuOption);
      }
    }

    return rootMenus;
  }

  // console.debug(
  //   '原始路由:',
  //   JSON.stringify(
  //     routes.map((route) => ({
  //       // path
  //       // name
  //       // meta
  //       ...route,
  //       props: undefined,
  //       children: undefined,
  //       instances: undefined,
  //       leaveGuards: undefined,
  //       updateGuards: undefined,
  //       enterCallbacks: undefined,
  //       components: undefined,
  //     })),
  //     null,
  //     0,
  //   ),
  // );
  // console.debug('转换后的菜单:', JSON.stringify(options.value, null, 0));

  return {
    options,
    selectedKey,
    // expanded-keys // 展开的子菜单标识符数组，如果设定了，菜单的展开将会进入受控状态，default-expanded-keys 不会生效
  };
}
