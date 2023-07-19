import { createI18n } from 'vue-i18n'
import zh from './languages/zh-TW.json'
import en from './languages/en-US.json'
import myLocalforge from './localForge'

type MessageSchema = typeof zh

const fromLang:any = await myLocalforge.get('lang');

const i18n = createI18n<[MessageSchema], 'zh-TW' | 'en-US'>({
  legacy: false, // 要把 legacy 設為 false，才可以使用 Composition API
  locale: fromLang??'zh-TW',
  fallbackLocale: fromLang??'zh-TW',
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
