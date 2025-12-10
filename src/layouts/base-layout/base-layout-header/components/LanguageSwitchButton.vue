<script setup lang="ts">
import type { DropdownOption } from 'naive-ui';

const { locale, availableLocales } = useI18n({ useScope: 'global' });

const languageLabels: Record<string, string> = {
  'en-US': 'English',
  'zh-CN': '简体中文',
};

const options = computed<DropdownOption[]>(() =>
  availableLocales.map((lang) => ({
    label: languageLabels[lang] || lang,
    key: lang,
    disabled: locale.value === lang,
  })),
);

function handleSelect(key: string) {
  locale.value = key;
}
</script>

<template>
  <NDropdown trigger="hover" placement="bottom-end" :options="options" @select="handleSelect">
    <NButton quaternary class="flex items-center gap-1">
      <template #icon>
        <IconClarityLanguageLine w-4.5 h-4.5 />
      </template>
      <span>{{ languageLabels[locale] }}</span>
    </NButton>
  </NDropdown>
</template>
