import type { I18nOptions } from 'vue-i18n';

const modules = import.meta.glob(['./*.ts', '!./route-messages-auto-imports'], {
  eager: true /* true 为同步，false 为异步 */,
  import: 'default',
});

type MessageType = Record<string, string>;

export const i18nRouteMessages: I18nOptions['messages'] = Object.entries(modules).reduce(
  (messages, [path, mod]) => {
    const locale = path.replace(/(\.\/|\.ts)/g, '');
    messages[locale] = mod as MessageType;
    return messages;
  },
  {} as Record<string, MessageType>,
);
