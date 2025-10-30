<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui';
import { darkTheme } from 'naive-ui';
import type { FunctionalComponent } from 'vue';
import { createTextVNode } from 'vue';

const appStore = useAppStore();

// https://www.naiveui.com/zh-CN/light/docs/customize-theme
const themeOverrides: GlobalThemeOverrides = {
  common: {},
};

const ContextHolder: FunctionalComponent = () => {
  window.$nLoadingBar = useLoadingBar();
  window.$nDialog = useDialog();
  window.$nModal = useModal();
  window.$nMessage = useMessage();
  window.$nNotification = useNotification();
  return createTextVNode();
};
</script>

<script lang="ts">
declare global {
  export interface Window {
    $nLoadingBar?: import('naive-ui').LoadingBarProviderInst;
    $nDialog?: import('naive-ui').DialogProviderInst;
    $nModal?: import('naive-ui').ModalProviderInst;
    $nMessage?: import('naive-ui').MessageProviderInst;
    $nNotification?: import('naive-ui').NotificationProviderInst;
  }

  /** Build time of the project */
  export const BUILD_TIME: string;
}
</script>

<template>
  <NConfigProvider
    :theme-overrides
    preflight-style-disabled
    :theme="appStore.isDark ? darkTheme : null"
    abstract
  >
    <NLoadingBarProvider>
      <NDialogProvider>
        <NModalProvider>
          <NNotificationProvider>
            <NMessageProvider>
              <ContextHolder />
              <slot></slot>
            </NMessageProvider>
          </NNotificationProvider>
        </NModalProvider>
      </NDialogProvider>
    </NLoadingBarProvider>
  </NConfigProvider>
</template>
