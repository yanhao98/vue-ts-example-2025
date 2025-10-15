<script setup lang="ts">
import { AdminLayout } from '@sa/materials';
import BaseLayoutHeader from './base-layout-header.vue';

const siderCollapse = ref(false);
const appStore = useAppStore();
</script>

<template>
  <AdminLayout :is-mobile="appStore.isMobile" v-model:sider-collapse="siderCollapse">
    <template #header>
      <BaseLayoutHeader v-model:collapsed="siderCollapse" />
    </template>
    <template #tab>
      <div class="bg-green-100/28 dark:bg-green-900/28 text-green-900 dark:text-green-100 p-4">
        2#GlobalTab
      </div>
    </template>
    <template #sider>
      <div
        class="bg-purple-100/28 dark:bg-purple-900/28 text-purple-900 dark:text-purple-100 p-4 h-full overflow-hidden"
      >
        3#GlobalSider
      </div>
    </template>
    <div class="bg-yellow-100/28 dark:bg-yellow-900/28 text-yellow-900 dark:text-yellow-100 p-4">
      4#GlobalMenu
    </div>
    <!-- <div>GlobalContent</div> -->
    <RouterView />
    <!-- <div>ThemeDrawer</div> -->
    <template #footer>
      <div class="bg-red-100/28 dark:bg-red-900/28 text-red-900 dark:text-red-100 h-full">
        5#GlobalFooter
      </div>
    </template>
  </AdminLayout>
</template>

<style lang="scss">
#__SCROLL_EL_ID__ {
  @include scrollbar;
}
</style>
