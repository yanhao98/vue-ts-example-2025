import { minify as minifyHtml } from 'html-minifier-terser';
import { loadEnv } from 'vite';
import type { ConfigEnv, PluginOption } from 'vite';

function IndexHtmlPlugin(): PluginOption {
  return {
    name: 'index-html-plugin',
    apply: 'build',
    async transformIndexHtml(html) {
      console.time('minifyHtml');
      // 压缩 HTML
      const minifiedHtml = await minifyHtml(html, {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true,
      });
      console.log();
      console.timeEnd('minifyHtml');
      return minifiedHtml;
    },
  };
}

function ___(): PluginOption {
  // https://github.com/hu3dao/vite-plugin-debug/blob/2935025e8ce082b9a5aef04766bcae3e996b3e55/src/index.ts
  return {
    name: 'vant-touch-emulator-online',
    apply: 'build',
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: {
              src: 'https://testingcf.jsdelivr.net/npm/@vant/touch-emulator/dist/index.min.js',
              // 这里的 `.min.js` 是 jsDelivr 的特殊处理
              // src: 'https://unpkg.luckincdn.com/@vant/touch-emulator@1.4.0/dist/index.js',
            },
            injectTo: 'body',
          },

          // >>>>> eruda

          {
            tag: 'script',
            attrs: {
              src: 'https://testingcf.jsdelivr.net/npm/eruda/eruda.js',
            },
            injectTo: 'body',
          },
          {
            tag: 'script',
            children: `eruda.init();`,
            injectTo: 'body',
          },
          // https://eruda.liriliri.io/zh/docs/#快速上手
          //   import('eruda').then(({ default: eruda }) => {
          //     eruda.init({
          //       defaults: {
          //         transparency: 0.9,
          //       },
          //     })
          //     /* eruda.show(); */
          //   })
          // }
          // <<<<<

          // >>>>> vConsole
          {
            tag: 'script',
            attrs: {
              src: 'https://cdn.jsdelivr.net/npm/vconsole@latest/dist/vconsole.min.js',
            },
            injectTo: 'body',
          },
          {
            tag: 'script',
            children: `new window.VConsole();`,
            injectTo: 'body',
          },
          // <<<<<
        ],
      };
    },
  };
}

export function loadPlugin(_configEnv: ConfigEnv): PluginOption {
  // return [___()];
  const env = loadEnv(_configEnv.mode, process.cwd());
  if (env.VITE_BUILD_MINIFY === 'true') return IndexHtmlPlugin();
}
