import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueRouter from 'unplugin-vue-router/vite';
import VueMacros from 'vue-macros/vite';

import type { LoadPluginFunction } from './_loadPlugins';

export const loadPlugin: LoadPluginFunction = async (_pluginLoadOptions) => {
  return [
    VueMacros({
      plugins: {
        vue: vue({ include: [/\.vue$/, /\.md$/] }),
        vueJsx: vueJsx(),

        // https://uvr.esm.is/guide/configuration.html
        // https://github.com/posva/unplugin-vue-router
        // ⚠️ Vue must be placed after VueRouter()
        vueRouter: vueRouter({
          routesFolder: 'src/pages',
          extensions: ['.page.vue', '.page.md'],
          exclude: ['**/__*', '**/__*/**/*'],
          getRouteName: (await import('unplugin-vue-router')).getPascalCaseRouteName,
          beforeWriteFiles(rootRoute) {
            for (/* 深度优先遍历 */ const route of rootRoute.traverseDFS()) {
              route.addToMeta({ _: route.fullPath });
            }
          },
          logs: !true,
        }),
      },
    }),
  ];
};
