import { DataLoaderPlugin } from 'unplugin-vue-router/data-loaders';
import { setupLayouts } from 'virtual:meta-layouts';
// import { createGetRoutes, setupLayouts } from 'virtual:generated-layouts';
import { createRouter, createWebHistory } from 'vue-router';
import { handleHotUpdate, routes } from 'vue-router/auto-routes';

const setupLayoutsResult = setupLayouts(routes);
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: /* routes ?? */ setupLayoutsResult,
  scrollBehavior: (_to, _from, savedPosition) => {
    return savedPosition ?? { left: 0, top: 0 };
  },
  strict: true,
});

if (__DEV__) Object.assign(globalThis, { router });
router.onError((error) => {
  console.debug('🚨 [router error]:', error);
});

export { router, setupLayoutsResult };
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

/*
definePage({
  meta: { },
});
 */
declare module 'vue-router' {
  interface RouteMeta {
    /**
     * @description 是否在菜单中隐藏
     */
    hidden?: boolean;
    /**
     * @description 菜单标题
     */
    title?: string;

    /**
     * @description 使用的布局，设置为 false 则表示不使用布局
     */
    layout?: string | false;
  }
}

export { createGetRoutes } from 'virtual:meta-layouts';

// This will update routes at runtime without reloading the page
if (import.meta.hot) handleHotUpdate(router);
