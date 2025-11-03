<script setup lang="ts">
import LanguageSwitchButton from './components/LanguageSwitchButton.vue';
import ThemeSwitchButton from './components/ThemeSwitchButton.vue';
import ToggleSiderButton from './components/ToggleSiderButton.vue';
import UserDropdown from './components/UserDropdown.vue';
</script>

<template>
  <div class="h-full flex items-center justify-between px-12px shadow-header dark:shadow-gray-700">
    <ToggleSiderButton />

    <div class="flex items-center">
      <LanguageSwitchButton />
      <ThemeSwitchButton />
      <UserDropdown />
    </div>
  </div>
</template>
