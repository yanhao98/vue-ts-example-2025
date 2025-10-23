import type { PluginOption } from 'vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import Icons from 'unplugin-icons/vite';

export default [
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
] satisfies PluginOption;
