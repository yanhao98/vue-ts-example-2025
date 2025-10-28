<script setup lang="ts">
import type { ToastMessageOptions } from 'primevue/toast';

definePage({
  meta: {},
});
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
              v-for="severity in [
                'secondary',
                'success',
                'info',
                'warn',
                'error',
                'contrast',
                undefined,
              ] satisfies ToastMessageOptions['severity'][]"
              :key="severity ?? 'default'"
              @click="
                ToastService.add({
                  severity: severity,
                  summary: `severity: ${severity ?? 'default'}`,
                  life: 5000,
                  detail: '消息内容',
                })
              "
            >
              {{ `${severity ?? 'default'}` }}
            </Button>
          </div>
        </Panel>
      </template>
    </Card>
  </div>
</template>
