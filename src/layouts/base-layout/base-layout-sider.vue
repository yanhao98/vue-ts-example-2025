<script setup lang="tsx">
import { useAppStore } from '@/stores/app-store';

const menuInstRef = useTemplateRef('menuInstRef');
const { options, selectedKey } = useMetaLayoutsNMenuOptions({
  menuInstRef,
});

const appStore = useAppStore();
</script>

<template>
  <!-- @update:value="handleMenuUpdate" -->
  <NMenu
    ref="menuInstRef"
    v-model:value="selectedKey"
    mode="vertical"
    :collapsed="appStore.sidebarCollapsed"
    :collapsed-width="64"
    :icon-size="20"
    :collapsed-icon-size="24"
    :options="options"
    :inverted="false"
    :root-indent="32"
    :indent="32"
  />
</template>
