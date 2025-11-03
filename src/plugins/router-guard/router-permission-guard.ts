import type { Router } from 'vue-router';

export function createGuard(router: Router) {
  router.beforeEach(async (to /* , from */) => {
    const userStore = useAuthStore();

    if (to.name === 'Login') {
      userStore.clearToken('User navigated to login page');
    }

    if (to.meta.ignoreAuth) {
      return true;
    }

    if (!userStore.isLoggedIn) {
      console.debug('🔑 [permission-guard] 用户未登录，重定向到登录页');
      return { name: 'Login' };
    }
  });

  router.beforeResolve(async (/* to, from */) => {
    const userStore = useAuthStore();
    if (userStore.isLoggedIn && !userStore.userInfo) {
      console.debug('🔑 [permission-guard] 用户信息不存在，尝试获取用户信息');
      await userStore.fetchUserInfo();
    }
  });
}
