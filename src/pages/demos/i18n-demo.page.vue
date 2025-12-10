<script setup lang="ts">
definePage({ meta: { order: 1 } });
const { t, locale } = useI18n({});

function setLocale(newLocale: 'en-US' | 'zh-CN') {
  i18nInstance.global.locale.value = newLocale;
}
</script>

<template>
  <div class="p-4">
    <NH1>{{ t('page.i18n-demo.title') }}</NH1>

    <NCard :title="t('page.i18n-demo.change-language')">
      <NP>
        {{ t('page.i18n-demo.current-language') }}:
        <span class="font-bold">{{ locale }}</span>
      </NP>

      <NP>
        {{ t('page.i18n-demo.hello', { name: 'Kilo' }) }}
      </NP>

      <NSpace>
        <NButton type="primary" @click="setLocale('en-US')"> English </NButton>
        <NButton type="success" @click="setLocale('zh-CN')"> 简体中文 </NButton>
      </NSpace>
    </NCard>

    <!-- 这里响应式有问题: -->
    <NP> $route.meta.title: {{ $route.meta.title }} </NP>
    <!-- 这样才正常 -->
    <NP>
      routeI18nInstance.global.t($route.name): {{ routeI18nInstance.global.t($route.name) }}
    </NP>
  </div>
</template>
