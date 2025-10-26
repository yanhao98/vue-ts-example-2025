import type { I18nOptions } from 'vue-i18n';

const modules = import.meta.glob(['./*.ts', '!./_messages-auto-imports.ts'], {
  eager: true,
  import: 'default',
});

type MessageType = Record<string, string>;
export const locales4RouteMessages: I18nOptions['messages'] = Object.entries(modules).reduce(
  (messages, [path, mod]) => {
    const locale = path.replace(/(\.\/|\.ts)/g, '');
    messages[locale] = mod as MessageType;
    return messages;
  },
  {} as Record<string, MessageType>,
);
