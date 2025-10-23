import { autoAnimatePlugin } from '@formkit/auto-animate/vue';

export function install({ app }: { app: import('vue').App<Element> }) {
  app.config.globalProperties.__DEV__ = __DEV__;

  app.use(autoAnimatePlugin); // v-auto-animate="{ duration: 100 }"

  app.config.errorHandler = (error, instance, info) => {
    console.error('Global error:', error);
    console.error('Component:', instance);
    console.error('Error Info:', info);
    // 这里你可以：
    // 1. 发送错误到日志服务
    // 2. 显示全局错误提示
    // 3. 进行错误分析和处理
  };

  // if (import.meta.env.MODE === 'development' && '1' === ('2' as never)) {
  //   // TODO: https://github.com/hu3dao/vite-plugin-debug/
  //   // https://eruda.liriliri.io/zh/docs/#快速上手
  //   import('eruda').then(({ default: eruda }) => {
  //     eruda.init({
  //       defaults: {
  //         transparency: 0.9,
  //       },
  //     })
  //     /* eruda.show(); */
  //   })
  // }
}
