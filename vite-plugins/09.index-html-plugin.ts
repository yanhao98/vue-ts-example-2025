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

export function loadPlugin(_configEnv: ConfigEnv): PluginOption {
  const env = loadEnv(_configEnv.mode, process.cwd());
  if (env.VITE_BUILD_MINIFY === 'true') return IndexHtmlPlugin();
}
