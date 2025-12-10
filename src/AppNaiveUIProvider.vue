<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui';
import { darkTheme, dateZhCN, zhCN } from 'naive-ui';
import type { FunctionalComponent } from 'vue';
import { createTextVNode } from 'vue';

const appStore = useAppStore();

// https://www.naiveui.com/zh-CN/light/docs/customize-theme
const themeOverrides: GlobalThemeOverrides = {
  common: {},
};

const ContextHolder: FunctionalComponent = () => {
  window.$nLoadingBar = useLoadingBar();
  window.$nModal = useModal();
  window.$nDialog = useDialog();
  window.$nMessage = useMessage();
  window.$nNotification = useNotification();
  return createTextVNode();
};
</script>

<script lang="ts">
declare global {
  export interface Window {
    $nLoadingBar?: import('naive-ui').LoadingBarProviderInst;
    $nModal?: import('naive-ui').ModalProviderInst;
    $nDialog?: import('naive-ui').DialogProviderInst;
    $nMessage?: import('naive-ui').MessageProviderInst;
    $nNotification?: import('naive-ui').NotificationProviderInst;
  }
}
</script>

<template>
  <NConfigProvider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme-overrides
    preflight-style-disabled
    :theme="appStore.isDark ? darkTheme : null"
    abstract
  >
    <NLoadingBarProvider>
      <NMessageProvider>
        <NNotificationProvider>
          <NModalProvider>
            <NDialogProvider>
              <slot></slot>
              <ContextHolder />
            </NDialogProvider>
          </NModalProvider>
        </NNotificationProvider>
      </NMessageProvider>
    </NLoadingBarProvider>
  </NConfigProvider>
</template>
