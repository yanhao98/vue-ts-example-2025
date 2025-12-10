<script setup lang="ts">
const buttonRef = useTemplateRef('buttonRef');
const appStore = useAppStore();

function toggleCollapsed() {
  // https://github.com/tusen-ai/naive-ui/issues/3688
  // hover style 鼠标移出就会消失 如果是点击 button 会聚焦需要失去焦点才会恢复
  buttonRef.value?.$el.blur();
  appStore.toggleSidebar();
}
</script>

<template>
  <NTooltip :disabled="appStore.isMobile" placement="bottom-start">
    {{ appStore.sidebarCollapsed ? '展开菜单' : '收起菜单' }}
    <template #trigger>
      <NButton ref="buttonRef" quaternary @click="toggleCollapsed">
        <IconLineMdMenuFoldRight v-if="appStore.sidebarCollapsed" w-4.5 h-4.5 />
        <IconLineMdMenuFoldLeft v-else w-4.5 h-4.5 />
      </NButton>
    </template>
  </NTooltip>
</template>
