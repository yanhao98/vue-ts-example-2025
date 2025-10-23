import { DataLoaderPlugin } from 'unplugin-vue-router/data-loaders';
import { setupLayouts } from 'virtual:meta-layouts';
// import { createGetRoutes, setupLayouts } from 'virtual:generated-layouts';
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteNamedMap } from 'vue-router/auto-routes';
import { routes, handleHotUpdate } from 'vue-router/auto-routes';

const setupLayoutsResult = setupLayouts(routes);
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: /* routes ?? */ setupLayoutsResult,
  scrollBehavior: (_to, _from, savedPosition) => {
    return savedPosition ?? { left: 0, top: 0 };
  },
  strict: true,
});

router.onError((error) => {
  console.debug('🚨 [router error]:', error);
});

export function install({ app }: { app: import('vue').App<Element> }) {
  app
    // 在路由之前注册插件
    .use(DataLoaderPlugin, { router })
    // 添加路由会触发初始导航
    .use(router);
}
// ========================================================================
// =========================== Router Guards ==============================
// ========================================================================
{
  // 警告：路由守卫的创建顺序会影响执行流程，请勿调整
  createNProgressGuard(router);
  createLogGuard(router);
  Object.assign(globalThis, { stack: createStackGuard(router) });
}

declare module 'vue-router' {
  /* definePage({ meta: { title: '示例演示' } }); */
  interface RouteMeta {
    /**
     * @description 是否在菜单中隐藏
     */
    hideInMenu?: boolean;
    /**
     * @description 菜单标题
     */
    title?: string;

    /**
     * @description 使用的布局，设置为 false 则表示不使用布局
     */
    layout?: string | false;

    /**
     * @description 菜单项是否渲染为可点击链接，默认为 true
     * - true: 使用 RouterLink 包装，可点击跳转
     * - false: 仅渲染纯文本标签，不可点击（适用于分组标题）
     */
    link?: boolean;
  }
}

export { router, setupLayoutsResult };
export { createGetRoutes } from 'virtual:meta-layouts';
declare global {
  type PageTitleLocalizations = Record<keyof RouteNamedMap, string>;
}

if (__DEV__) Object.assign(globalThis, { router });
// This will update routes at runtime without reloading the page
if (import.meta.hot) {
  handleHotUpdate(router);
}
