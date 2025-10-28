<script setup lang="ts">
import type { ToastMessageOptions } from 'primevue/toast';

definePage({
  meta: {},
});

const tostSeverities = [
  'secondary',
  'success',
  'info' /* 默认 */,
  'warn',
  'error',
  'contrast',
  undefined,
] satisfies ToastMessageOptions['severity'][];

const openAllToasts = () => {
  tostSeverities.forEach((severity, index) => {
    setTimeout(() => {
      ToastService.add({
        severity,
        summary: `severity: ${severity ?? 'default'}`,
        life: 3000,
        detail: `${index + 1}. 消息内容`,
      });
    }, index * 500);
  });
};
</script>

<template>
  <div class="prime-vue-demo-page">
    <Card>
      <template #title>PrimeVue 组件演示</template>
      <template #content>
        <Message severity="info">演示 PrimeVue 各种组件的使用方法和功能特性</Message>

        <Panel header="Toast 消息" class="mt-1.5">
          <div flex="~ wrap" gap="4">
            <Button
              v-for="(severity, index) in tostSeverities"
              :key="severity ?? 'default'"
              @click="
                ToastService.add({
                  severity: severity,
                  summary: `severity: ${severity ?? 'default'}`,
                  life: 3000,
                  detail: '消息内容',
                })
              "
            >
              {{ `${index + 1}. ${severity ?? 'default'}` }}
            </Button>
            <Button @click="openAllToasts"> 一键打开所有 </Button>
          </div>
        </Panel>
      </template>
    </Card>
  </div>
</template>
