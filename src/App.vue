<script setup lang="ts">
import { RouterView } from 'vue-router';
import { darkTheme, type GlobalThemeOverrides } from 'naive-ui';
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
