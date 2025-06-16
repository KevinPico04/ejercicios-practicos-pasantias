import React, { createContext, useState } from 'react';  // ¡Importa React explícitamente!

import enTranslations from '../assets/translations/en.json';
import esTranslations from '../assets/translations/es.json';

// Objeto de traducciones con valores por defecto
const translations = {
  en: {
    ...enTranslations,
    // Puedes agregar valores por defecto aquí si algún campo falta
    missing_key: 'Default English Text'
  },
  es: {
    ...esTranslations,
    missing_key: 'Texto en español por defecto'
  }
};

// Manejo de errores mejorado
const safeTranslate = (translationsObj, key) => {
  try {
    return translationsObj[key] || key; // Devuelve el key si no encuentra la traducción
  } catch (error) {
    console.warn(`Translation error for key "${key}":`, error);
    return key;
  }
};

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es');
  
  // Función de traducción mejorada
  const translate = (key, fallbackValue = key) => {
    return translations[language]?.[key] || fallbackValue;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};