<script setup lang="ts">
import { NBlockquote, NCode } from 'naive-ui';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import type { FunctionalComponent } from 'vue';
import { h } from 'vue';

hljs.registerLanguage('json', json);

definePage({ meta: { link: true } });

const FComponent: FunctionalComponent<{ prop: string }> = (props) =>
  h('div', [
    h(NBlockquote, null, [
      '函数式组件文档:',
      h(
        'a',
        {
          class: 'text-blue-500 hover:text-blue-600 transition-colors',
          href: 'https://cn.vuejs.org/guide/extras/render-function#typing-functional-components',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
        'Render Function & JSX',
      ),
    ]),
    h('p', { class: 'my-4' }, '这是一个函数式组件，它接收到的 prop 值为：'),
    h(NCode, { code: JSON.stringify(props, null, 2), language: 'json', hljs }),
  ]);
</script>

<template>
  <NCard title="函数式组件（TSX）示例">
    <FComponent prop="some-prop-value" />
  </NCard>
</template>
