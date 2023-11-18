import type ru from '../locales/ru.json'


declare module 'i18next' {
  interface CustomTypeOptions {
    resources: typeof ru
  }
}
