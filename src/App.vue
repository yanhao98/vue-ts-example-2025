<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppNaiveUIProvider from './AppNaiveUIProvider.vue';
</script>

<template>
  <DynamicDialog />
  <ConfirmDialog />
  <Toast />

  <AppNaiveUIProvider>
    <RouterView />
  </AppNaiveUIProvider>
</template>
