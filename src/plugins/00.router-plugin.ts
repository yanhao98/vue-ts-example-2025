import { DataLoaderPlugin } from 'unplugin-vue-router/data-loaders';
import { setupLayouts } from 'virtual:meta-layouts';
// import { createGetRoutes, setupLayouts } from 'virtual:generated-layouts';
import { createRouter, createWebHistory } from 'vue-router';
import type { Router } from 'vue-router';
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

router.isReady().then(() => {
  console.debug('✅ [router is ready]');
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
  if (import.meta.env.VITE_APP_ENABLE_ROUTER_LOG_GUARD === 'true') createLogGuard(router);
  Object.assign(window, { stack: createStackGuard(router) });

  // >>>
  Object.values(
    import.meta.glob<{
      createGuard?: (router: Router) => void;
    }>('./router-guard/*.ts', { eager: true /* true 为同步，false 为异步 */ }),
  ).forEach((module) => {
    module.createGuard?.(router);
  });
  // <<<
}

if (__DEV__) Object.assign(window, { router });

// This will update routes at runtime without reloading the page
if (import.meta.hot) {
  handleHotUpdate(router);
}

export { router, setupLayoutsResult };
