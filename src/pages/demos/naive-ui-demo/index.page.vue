<script setup lang="ts">
import type { MessageType } from 'naive-ui';
import { useDialog, useMessage } from 'naive-ui';

definePage({ meta: {} });

const message = useMessage();
const dialog = useDialog();

const messageTypes = ['info', 'success', 'warning', 'error', 'loading'] satisfies MessageType[];
const dialogTypes = ['info', 'success', 'warning', 'error'] as const;

const openAllMessages = () => {
  messageTypes.forEach((type, index) => {
    setTimeout(() => {
      message[type](`${index + 1}. 消息内容`, {
        duration: 3000,
        closable: true,
      });
    }, index * 500);
  });
};

const openDialog = (type: (typeof dialogTypes)[number]) => {
  dialog[type]({
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} 弹窗`,
    content: '这是一个命令式 API 创建的弹窗示例。',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      message.success('点击了确定');
    },
    onNegativeClick: () => {
      message.error('点击了取消');
    },
  });
};

const openModal = () => {
  window.$nModal!.create({
    title: '命令式 Modal 示例',
    content: '这是一个命令式 API 创建的 Modal 示例，使用 preset="dialog"。',
    preset: 'dialog',
    onPositiveClick: () => {
      message.success('点击了确定');
    },
    onNegativeClick: () => {
      message.error('点击了取消');
    },
    positiveText: '确定',
    negativeText: '取消',
  });
};
</script>

<template>
  <div class="naive-ui-demo-page">
    <NCard>
      <template #header>Naive UI 组件演示</template>
      <NAlert title="信息" type="info" :bordered="false">
        演示 Naive UI 各种组件的使用方法和功能特性
      </NAlert>
      <NCard title="Message 消息" class="mt-4">
        <NSpace>
          <NButton
            v-for="(type, index) in messageTypes"
            :key="type"
            @click="
              message[type](`${index + 1}. 消息内容`, {
                duration: 3000,
                closable: true,
              })
            "
          >
            {{ `${index + 1}. ${type}` }}
          </NButton>
          <NButton @click="openAllMessages"> 一键打开所有 </NButton>
        </NSpace>
      </NCard>

      <NCard title="Dialog 弹窗 (命令式 API)" class="mt-4">
        <NSpace>
          <NButton v-for="type in dialogTypes" :key="type" @click="openDialog(type)">
            {{ type }}
          </NButton>
        </NSpace>
      </NCard>

      <NCard title="Modal 弹窗 (命令式 API)" class="mt-4">
        <NSpace>
          <NButton @click="openModal"> 打开 Modal </NButton>
        </NSpace>
      </NCard>
    </NCard>
  </div>
</template>
