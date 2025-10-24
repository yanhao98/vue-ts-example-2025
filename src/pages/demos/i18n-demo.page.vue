<script setup lang="ts">
definePage({
  meta: {
    order: 1,
  },
});
const { t, locale } = useI18n();

function setLocale(newLocale: 'en-US' | 'zh-CN') {
  locale.value = newLocale;
}
</script>

<template>
  <div class="p-4">
    <n-h1>{{ t('page.i18n-demo.title') }}</n-h1>

    <n-card :title="t('page.i18n-demo.change-language')">
      <n-p>
        {{ t('page.i18n-demo.current-language') }}:
        <span class="font-bold">{{ locale }}</span>
      </n-p>

      <n-p>
        {{ t('page.i18n-demo.hello', { name: 'Kilo' }) }}
      </n-p>

      <n-space>
        <n-button type="primary" @click="setLocale('en-US')"> English </n-button>
        <n-button type="success" @click="setLocale('zh-CN')"> 简体中文 </n-button>
      </n-space>
    </n-card>
  </div>
</template>
