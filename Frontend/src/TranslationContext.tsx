import React, { createContext, useState, useContext } from 'react';
import en from './translations/en.json';
import hi from './translations/hi.json';

// Define a context type for managing language and translations
interface TranslationContextType {
  language: string;
  translations: any;
  setLanguage: (language: string) => void;
}

// Default language is English
const defaultLanguage = 'EN';
const defaultTranslations = en;

// Create the Translation context
const TranslationContext = createContext<TranslationContextType>({
  language: defaultLanguage,
  translations: defaultTranslations,
  setLanguage: () => {},
});

// Define the type for the props of the TranslationProvider, specifically the children prop
interface TranslationProviderProps {
  children: React.ReactNode;
}

// Translation provider component
export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>(defaultLanguage);

  // Set translations based on the selected language
  const translations = language === 'EN' ? en : hi;

  return (
    <TranslationContext.Provider value={{ language, translations, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Custom hook to use the Translation context
export const useTranslation = () => useContext(TranslationContext);
