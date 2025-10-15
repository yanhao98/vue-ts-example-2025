// 请确保在 `main.ts` 文件中添加以下导入语句：import 'virtual:uno.css';

// https://github.dev/unocss/unocss/tree/main/examples/vite-vue3

import {
  defineConfig,
  presetAttributify,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';
import { presetAnimations } from 'unocss-preset-animations';

export default defineConfig({
  presets: [
    presetWind4({ dark: { dark: '.app-dark' } }),

    // https://unocss-preset-animations.aelita.me
    presetAnimations(),

    // https://unocss.dev/presets/attributify
    presetAttributify(),
  ],

  shortcuts: [
    {
      'logo-transform': 'i-icon:pacman w-6em h-6em transform transition-800',
      pacman: 'i-icon:pacman text-(pink 36)',
    },
  ],
  transformers: [
    //https://unocss.dev/transformers/variant-group
    transformerVariantGroup(),

    // https://unocss.dev/transformers/directives
    transformerDirectives(),
  ],
});

/*
  示例:
  - text-[var(--h-gray-1)]
*/
