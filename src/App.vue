<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppNaiveUIProvider from './AppNaiveUIProvider.vue';
</script>

<template>
  <DynamicDialog />
  <ConfirmDialog />
  <Toast style="z-index: 5000" />

  <AppNaiveUIProvider>
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </AppNaiveUIProvider>
</template>
