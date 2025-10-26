<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui';
import { darkTheme } from 'naive-ui';
import { RouterView } from 'vue-router';

const appStore = useAppStore();

// https://www.naiveui.com/zh-CN/light/docs/customize-theme
const themeOverrides: GlobalThemeOverrides = {
  common: {},
};
</script>

<template>
  <DynamicDialog />
  <ConfirmDialog />
  <Toast />
  <n-config-provider
    :theme-overrides
    preflight-style-disabled
    :theme="appStore.isDark ? darkTheme : null"
    abstract
  >
    <RouterView />
  </n-config-provider>
</template>
