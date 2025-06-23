import React, { createContext, useState } from 'react';

import enTranslations from '../assets/translations/en.json';
import esTranslations from '../assets/translations/es.json';

const translations = {
  en: {
    ...enTranslations,
    missing_key: 'Default English Text',
  },
  es: {
    ...esTranslations,
    missing_key: 'Texto en español por defecto',
  },
};

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es');

  const safeTranslate = (key, fallbackValue = key) => {
    try {
      return translations[language]?.[key] || fallbackValue;
    } catch (error) {
      console.warn(`Translation error for key "${key}":`, error);
      return fallbackValue;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate: safeTranslate }}>
      {children}
    </LanguageContext.Provider>
  );
};
