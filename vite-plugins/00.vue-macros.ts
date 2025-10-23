import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { getPascalCaseRouteName } from 'unplugin-vue-router';
import vueRouter from 'unplugin-vue-router/vite';
import type { PluginOption } from 'vite';
import VueMacros from 'vue-macros/vite';

export default [
  VueMacros({
    plugins: {
      vue: vue({ include: [/\.vue$/, /\.md$/] }),
      vueJsx: vueJsx(),

      // https://uvr.esm.is/guide/configuration.html
      // https://github.com/posva/unplugin-vue-router
      // ⚠️ Vue must be placed after VueRouter()
      vueRouter: vueRouter({
        exclude: ['**/__*', '**/__*/**/*'],
        extensions: ['.page.vue', '.page.md'],
        getRouteName: (routeNode) => getPascalCaseRouteName(routeNode),
        logs: false,
        routesFolder: 'src/pages',
      }),
    },
  }),
] satisfies PluginOption;
