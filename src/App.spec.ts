/**
 * @vitest-environment happy-dom
 */

/*
 * https://pinia.vuejs.org/zh/cookbook/testing.html#unit-testing-components
 */

import { describe, expect, it } from 'vitest';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      component: {
        template: 'Welcome to the blogging app',
      },
    },
  ],
});

import { mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import App from './App.vue';

describe('App', () => {
  it('renders RouterView', async () => {
    router.push('/');
    await router.isReady();

    const wrapper = mount(App, { global: { plugins: [router, createPinia()] } });
    expect(wrapper.text()).toContain('Welcome to the blogging app');
  });
});
