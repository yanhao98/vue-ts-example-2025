<script setup lang="ts">
definePage({ meta: { ignoreAuth: true, layout: false } });

const router = useRouter();
const userStore = useAuthStore();
const message = useMessage();

const formValue = ref({
  username: 'admin',
  password: 'admin',
});

const loading = ref(false);

async function handleLogin() {
  if (!formValue.value.username || !formValue.value.password) {
    message.warning('请输入用户名和密码');
    return;
  }

  loading.value = true;
  try {
    const result = await userStore.login(formValue.value.username, formValue.value.password);
    if (result.success) {
      message.success('登录成功');
      router.push('/');
    } else {
      message.error(result.message || '登录失败');
    }
  } catch {
    message.error('登录异常');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-page">
    <NCard class="login-card" title="用户登录">
      <NForm :model="formValue" label-placement="left" label-width="80">
        <NFormItem label="用户名" path="username">
          <NInput
            v-model:value="formValue.username"
            placeholder="请输入用户名"
            @keyup.enter="handleLogin"
          />
        </NFormItem>
        <NFormItem label="密码" path="password">
          <NInput
            v-model:value="formValue.password"
            type="password"
            show-password-on="click"
            placeholder="请输入密码"
            @keyup.enter="handleLogin"
          />
        </NFormItem>
        <NFormItem :show-label="false">
          <NButton type="primary" block :loading="loading" @click="handleLogin"> 登录 </NButton>
        </NFormItem>
      </NForm>
      <div class="login-hint">
        <NText depth="3">提示：用户名和密码均为 admin</NText>
      </div>
    </NCard>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 400px;
  max-width: 90%;
}

.login-hint {
  margin-top: 16px;
  text-align: center;
}
</style>
