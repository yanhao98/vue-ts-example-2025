<script setup lang="ts">
import { AdminLayout } from '@sa/materials';
import BaseLayoutHeader from './base-layout-header/base-layout-header.vue';
import BaseLayoutSider from './base-layout-sider.vue';

const appStore = useAppStore();
</script>

<template>
  <AdminLayout
    v-model:sider-collapse="appStore.sidebarCollapsed"
    mode="horizontal"
    :footer-visible="!false"
    :tab-visible="!false"
    scroll-mode="content"
    :is-mobile="appStore.isMobile"
  >
    <template #header>
      <BaseLayoutHeader />
    </template>
    <template #tab>
      <div
        class="bg-green-100/28 dark:bg-green-900/28 text-green-900 dark:text-green-100 flex h-full items-center justify-center"
      >
        GlobalTab
      </div>
    </template>
    <template #sider>
      <BaseLayoutSider />
    </template>
    <!-- <div>GlobalContent</div> -->
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
    <!-- <div>ThemeDrawer</div> -->
    <template #footer>
      <div
        class="bg-red-100/28 dark:bg-red-900/28 text-red-900 dark:text-red-100 h-full flex items-center justify-center"
      >
        GlobalFooter
      </div>
    </template>
  </AdminLayout>
</template>

<style lang="scss">
#__SCROLL_EL_ID__ {
  @include scrollbar;
}
</style>
