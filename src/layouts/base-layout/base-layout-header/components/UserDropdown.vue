<script setup lang="tsx">
const router = useRouter();
const userStore = useAuthStore();
const dialog = useDialog();

const options = computed(() => [
  {
    label: userStore.userInfo?.nickname || userStore.userInfo?.username || '用户',
    key: 'user',
    disabled: true,
  },
  {
    type: 'divider',
    key: 'd1',
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => <icon-material-symbols-logout class="w-4 h-4" />,
  },
]);

function handleSelect(key: string) {
  if (key === 'logout') {
    dialog.warning({
      title: '退出登录',
      content: '确定要退出登录吗?',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        userStore.clearToken('用户退出登录');
        router.push('/login');
      },
    });
  }
}
</script>

<template>
  <NDropdown :options="options" placement="bottom-end" @select="handleSelect">
    <NButton quaternary circle>
      <icon-material-symbols-account-circle w-5 h-5 />
    </NButton>
  </NDropdown>
</template>
