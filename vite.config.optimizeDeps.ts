import type { DepOptimizationOptions } from 'vite';

// const primevuecomponents = await (async () => {
//   const { components } = await import('@primevue/metadata');
//   return components.map((c) => c.from).filter((c) => c !== undefined);
// })();
export function optimizeDeps(): DepOptimizationOptions {
  return {
    entries: ['src/main.ts', 'src/pages/**/*.vue'],
    // include: [
    //   ...primevuecomponents,
    //   '@primeuix/themes',
    //   '@primeuix/themes/lara',
    //   'class-variance-authority',
    //   'clsx',
    //   'tailwind-merge',
    //   'reka-ui',
    //   'axios',
    //   '@ant-design/icons-vue',
    //   'ant-design-vue/es',
    //   'p5',
    //   '@splinetool/runtime',
    //   'satellite.js',
    //   'ts-enum-util',
    //   'unplugin-vue-router',
    //   'unplugin-vue-router/runtime',
    //   'unplugin-vue-router/data-loaders/basic',
    //   'unplugin-vue-router/data-loaders/pinia-colada',
    //   'eruda',
    //   'simplebar-vue',
    // ],
    // exclude: ['quill', 'chart.js/auto'],
  };
}
