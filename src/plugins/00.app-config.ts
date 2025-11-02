export function install({ app }: { app: import('vue').App<Element> }) {
  app.config.globalProperties.__DEV__ = __DEV__;

  app.config.errorHandler = (error, instance, info) => {
    console.error('Global error:', error);
    console.error('Component:', instance);
    console.error('Error Info:', info);
    // 这里你可以：
    // 1. 发送错误到日志服务
    // 2. 显示全局错误提示
    // 3. 进行错误分析和处理
  };
}
