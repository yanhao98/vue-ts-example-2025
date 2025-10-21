import { cloudflare } from '@cloudflare/vite-plugin';
import VueI18n from '@intlify/unplugin-vue-i18n/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import { VantResolver } from '@vant/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'node:path';
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import {
  AntDesignVueResolver,
  NaiveUiResolver,
  TDesignResolver,
} from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import Markdown from 'unplugin-vue-markdown/vite';
import { getPascalCaseRouteName, VueRouterAutoImports } from 'unplugin-vue-router';
import vueRouter from 'unplugin-vue-router/vite';
import { createUtils4uAutoImports } from 'utils4u/auto-imports';
import { type PluginOption } from 'vite';
import { checker } from 'vite-plugin-checker';
import { vitePluginFakeServer } from 'vite-plugin-fake-server';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import vueDevTools from 'vite-plugin-vue-devtools';
import MetaLayouts from 'vite-plugin-vue-meta-layouts';
import { ViteWebfontDownload } from 'vite-plugin-webfont-dl';
import VueMacros from 'vue-macros/vite';
import { IndexHtmlPlugin } from './vite.config.plugin.index-html-plugin';

export function Plugins({
  mode,
  env,
}: {
  mode: string;
  env: Record<string, string>;
}): PluginOption[] {
  const plugins: PluginOption[] = [
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
  ];

  plugins.push(
    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts?tab=readme-ov-file#configuration
    // Layouts({ defaultLayout: 'sakai-vue/AppLayout', pagesDirs: [] }),

    // https://github.com/dishait/vite-plugin-vue-meta-layouts
    MetaLayouts({
      // defaultLayout: 'sakai-vue/AppLayout',
      // defaultLayout: 'naive-ui/AppLayout',
      defaultLayout: 'base-layout/base-layout',
      skipTopLevelRouteLayout: true, // 打开修复 https://github.com/JohnCampionJr/vite-plugin-vue-layouts/issues/134，默认为 false 关闭
    }),
  );

  plugins.push(
    // https://github.com/unplugin/unplugin-vue-markdown
    Markdown({
      headEnabled: true,
    }),

    cloudflare(),
  );

  plugins.push(
    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    UnoCSS(),
  );

  plugins.push(
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      dirs: [
        // 'src/composables',
        // 'src/utils',
        'src/stores',
      ],
      imports: [
        'vue',
        'vue-i18n',
        'pinia',
        '@vueuse/core',
        VueRouterAutoImports,
        createUtils4uAutoImports([]),
        {
          'consola/browser': ['consola'],
          'vue-router/auto': ['useLink'],
          'naive-ui': ['useModal', 'useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
        },
      ],
      vueTemplate: true,
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      // __开头的
      excludeNames: [/^__/],
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
          resolveIcons: true,
        }),
        IconsResolver({
          customCollections: ['svg'],
          prefix: 'icon' /* <icon-svg:demo /> or <icon-svg-demo /> */,
        }), // https://github.com/unplugin/unplugin-icons?tab=readme-ov-file#auto-importing
        TDesignResolver({ esm: true, library: 'mobile-vue' }),
        VantResolver({ importStyle: true }),
        PrimeVueResolver(/* { components: { prefix: 'P' } } */),
        NaiveUiResolver(),
      ],
    }),

    Icons({
      autoInstall: true,
      customCollections: {
        svg: FileSystemIconLoader('src/assets/icons/svgs', (svg) => {
          return svg.replace(/^<svg /, '<svg fill="currentColor" ');
        }),
      },
      iconCustomizer(collection, icon, properties) {
        properties.class = 'unplugin-icons';
      },
    }),

    // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
    VueI18n({
      /* options */
      // locale messages resource pre-compile option
      include: [path.resolve(import.meta.dirname, './src/locales/**')],

      // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#transformi18nblock
      // transformI18nBlock(src) {
      //   console.debug(`src :>> `, src);
      //   console.debug(`typeof src :>> `, typeof src);
      //   return src as string;
      // },
    }),
  );

  if (mode !== 'test') {
    plugins.push(
      // https://github.com/condorheroblog/vite-plugin-fake-server?tab=readme-ov-file#usage
      vitePluginFakeServer({
        basename: 'fake-api',
        enableProd: !true,
        include: 'fake',
      }),
    );
  }

  if (env.VITE_ENABLE_VUE_DEVTOOLS === 'true') {
    plugins.push(vueDevTools());
  }

  plugins.push(
    // https://vite-plugin-checker.netlify.app/introduction/introduction.html
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx,vue}"',
        useFlatConfig: true,
      },
      vueTsc: true,
      overlay: {
        initialIsOpen: false,
      },
      terminal: true,
      enableBuild: true,
      // XXX: pnpm add vls vti -D
    }),
  );

  plugins.push(
    // https://github.com/FatehAK/vite-plugin-image-optimizer?tab=readme-ov-file#default-configuration
    ViteImageOptimizer({
      /* pass your config */
    }),
  );

  // 检查是否在VS Code终端中运行
  if (process.env.TERM_PROGRAM === 'vscode' || process.env.VSCODE_PID) {
    // plugins.push(
    //   // 构建后自动将dist目录打包成zip文件
    //   viteArchiverPlugin({
    //     addTimestamp: false, // 是否添加时间戳到输出文件名
    //     format: 'zip', // 输出的压缩文件格式
    //     outputDir: '', // 输出目录，默认为项目根目录
    //     outputFileName: 'dist', // 输出的zip文件名（不含扩展名）
    //     sourceDir: 'dist', // 要打包的源目录
    //   }),
    // )
  }

  const _unused = () => {
    // plugins.push(
    //   // https://github.com/rsnakdmx/vite-plugin-purgecss-v5?tab=readme-ov-file#-usage
    //   pluginPurgeCss({
    //     variables: true,
    //   }),
    //   viteSingleFile(),
    //   viteStaticCopy({
    //     targets: [
    //       // globalThis.CESIUM_BASE_URL = 'https://digitalarsenal.io/';
    //       { dest: cesiumBaseUrl, src: `${cesiumSource}/ThirdParty` },
    //       { dest: cesiumBaseUrl, src: `${cesiumSource}/Workers` },
    //       { dest: cesiumBaseUrl, src: `${cesiumSource}/Assets` },
    //       { dest: cesiumBaseUrl, src: `${cesiumSource}/Widgets` },
    //     ],
    //   }),
    // )
    plugins.push(
      // https://github.com/feat-agency/vite-plugin-webfont-dl?tab=readme-ov-file#-usage-simple-config-method-b-
      ViteWebfontDownload([
        'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
        'https://fonts.googleapis.com/css2?family=Fira+Code&display=swap',
        'https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700,900',
      ]),
    );
  };

  plugins.push(IndexHtmlPlugin());

  return plugins;
}
