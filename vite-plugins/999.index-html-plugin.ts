import type { PluginOption } from 'vite';
import { minify as minifyHtml } from 'html-minifier-terser';

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

export default [IndexHtmlPlugin()] satisfies PluginOption[];
