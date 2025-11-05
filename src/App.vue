<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppNaiveUIProvider from './AppNaiveUIProvider.vue';
</script>

<template>
  <DynamicDialog />
  <ConfirmDialog />
  <Toast style="z-index: 5000" />

  <AppNaiveUIProvider>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </AppNaiveUIProvider>
</template>
