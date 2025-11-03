export const useAuthStore = defineStore('auth', () => {
  const token = useLocalStorage<string | null>('auth-token', null);
  const userInfo = ref<Record<string, any> | null>(null);

  const isLoggedIn = computed(() => !!token.value);

  function clearToken(reason?: string) {
    consola.info('🚮  [auth-store] clear: ', reason);
    token.value = null;
    userInfo.value = null;
  }

  async function login(username: string, password: string) {
    // 模拟登录延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 模拟验证
    if (username === 'admin' && password === 'admin') {
      token.value = `mock-token-${Date.now()}`;
      await fetchUserInfo();
      return { success: true };
    }

    return { success: false, message: '用户名或密码错误' };
  }

  async function fetchUserInfo() {
    if (!token.value) {
      return;
    }

    // 模拟获取用户信息延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 模拟从服务器获取用户信息
    userInfo.value = {
      id: 1,
      username: 'admin',
      nickname: '管理员',
      roles: ['admin'],
    };
  }

  return { token, isLoggedIn, userInfo, clearToken, login, fetchUserInfo };
});
