import { createI18n } from 'vue-i18n'
import English from './en'
import Spanish from './es'
const i18n = createI18n({
    locale: 'English',
    messages:{
        English,
        Spanish
    },
    fallbackLocale: 'English'
})
export default i18n;