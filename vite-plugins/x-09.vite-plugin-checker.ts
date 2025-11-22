import type { PluginOption } from 'vite';
import checker from 'vite-plugin-checker';

export default [
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
] satisfies PluginOption;
