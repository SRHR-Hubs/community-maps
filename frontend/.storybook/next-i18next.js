import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// fix courtesy of https://dev.to/justincy/using-next-i18next-in-storybook-3he9

i18n.use(initReactI18next).init({
    fallbackLng: 'en',
    debug: true,
});

export default i18n;