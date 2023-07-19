import { createI18n } from 'vue-i18n'
import zh from './languages/zh-TW.json'
import en from './languages/en-US.json'
import { storageGet } from '@/store'

type MessageSchema = typeof zh

const i18n = createI18n<[MessageSchema], 'zh-TW' | 'en-US'>({
  legacy: true, // 要把 legacy 設為 false，才可以使用 Composition API
  locale: 'zh-TW',
  fallbackLocale: 'zh-TW',
  globalInjection: true,
  messages: {
    'zh-TW': zh,
    'en-US': en
  }
})

export function changeLanguage(lang:string) {
    i18n.global.locale = lang;
}

export default i18n
