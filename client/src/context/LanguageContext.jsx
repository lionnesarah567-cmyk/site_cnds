import React, { createContext, useContext, useState, useEffect } from 'react';
import fr from '../i18n/fr.json';
import rn from '../i18n/rn.json';

const translations = { fr, rn };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('cnds_lang') || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('cnds_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = (newLang) => {
    if (newLang && (newLang === 'fr' || newLang === 'rn')) {
      setLang(newLang);
    } else {
      setLang((prev) => (prev === 'fr' ? 'rn' : 'fr'));
    }
  };

  const t = (path) => {
    const keys = path.split('.');
    let result = translations[lang];
    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        // Fallback to French if translation is missing in Kirundi
        let fallback = translations.fr;
        for (const fbKey of keys) {
          if (fallback && fallback[fbKey] !== undefined) {
            fallback = fallback[fbKey];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
