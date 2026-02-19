import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { translations } from "../components/i18n/translations";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState("en");

  useEffect(() => {
    const storedLang = localStorage.getItem("app_language");
    if (storedLang) {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: string) => {
    localStorage.setItem("app_language", lang);
    setLanguageState(lang);
  };

  const t = (key: string) => {
    return translations[language]?.[key] || key;
  };

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
};
