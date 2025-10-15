<script setup lang="ts">
import { RouterView } from 'vue-router';
import { darkTheme } from 'naive-ui';
const appStore = useAppStore();
</script>

<template>
  <DynamicDialog />
  <ConfirmDialog />
  <Toast />
  <n-config-provider preflight-style-disabled :theme="appStore.isDark ? darkTheme : null" abstract>
    <RouterView />
  </n-config-provider>
</template>
