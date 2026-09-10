import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import RNRestart from 'react-native-restart';

// Import all locales
import en from './locales/en.json';
import hi from './locales/hi.json';
import te from './locales/te.json';
import ta from './locales/ta.json';
import gu from './locales/gu.json';
import it from './locales/it.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';
import ml from './locales/ml.json';

const STORE_LANGUAGE_KEY = 'settings.lang';

const languageDetectorPlugin = {
  type: 'languageDetector' as const,
  async: true,
  init: () => {},
  detect: async function (callback: (lang: string) => void) {
    try {
      const language = await AsyncStorage.getItem(STORE_LANGUAGE_KEY);
      if (language) {
        return callback(language);
      } else {
        return callback('en');
      }
    } catch (error) {
      console.log('Error reading language', error);
      return callback('en');
    }
  },
  cacheUserLanguage: async function (language: string) {
    try {
      await AsyncStorage.setItem(STORE_LANGUAGE_KEY, language);
    } catch (error) {
      console.log('Error saving language', error);
    }
  }
};

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  te: { translation: te },
  ta: { translation: ta },
  gu: { translation: gu },
  it: { translation: it },
  fr: { translation: fr },
  ar: { translation: ar },
  ml: { translation: ml },
};

i18n
  .use(languageDetectorPlugin)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    react: {
      useSuspense: false
    }
  });

export const changeLanguage = async (lng: string) => {
  await i18n.changeLanguage(lng);
  
  // Handle RTL layout switching
  const isRTL = lng === 'ur' || lng === 'ar';
  
  if (isRTL !== I18nManager.isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    
    // Some implementations require a restart for RTL to take effect in RN
    try {
      if (RNRestart) {
        RNRestart.Restart();
      }
    } catch (e) {
      console.log('Restart module not available');
    }
  }
};

export default i18n;
