import type { PluginOption } from 'vite';

export default [
  // // 检查是否在VS Code终端中运行
  // if (process.env.TERM_PROGRAM === 'vscode' || process.env.VSCODE_PID) {
  //   // plugins.push(
  //   //   // 构建后自动将dist目录打包成zip文件
  //   //   viteArchiverPlugin({
  //   //     addTimestamp: false, // 是否添加时间戳到输出文件名
  //   //     format: 'zip', // 输出的压缩文件格式
  //   //     outputDir: '', // 输出目录，默认为项目根目录
  //   //     outputFileName: 'dist', // 输出的zip文件名（不含扩展名）
  //   //     sourceDir: 'dist', // 要打包的源目录
  //   //   }),
  //   // )
  // }
] satisfies PluginOption;
