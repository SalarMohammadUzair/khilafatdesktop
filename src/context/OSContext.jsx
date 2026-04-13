import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { translations } from '../data/translations';

const Ctx = createContext(null);

export function OSProvider({ children }) {
  const [wallpaper, setWallpaper] = useState(null);
  const [language, setLanguage] = useState('EN'); // 'EN' or 'UR'

  const t = useCallback((key) => {
    if (!translations[key]) return key;
    return translations[key][language] || key;
  }, [language]);

  useEffect(() => {
    if (language === 'UR') {
      document.body.classList.add('lang-ur');
    } else {
      document.body.classList.remove('lang-ur');
    }
  }, [language]);

  const value = useMemo(
    () => ({
      wallpaper,
      setWallpaper,
      language,
      setLanguage,
      t
    }),
    [wallpaper, language, t]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useOS = () => useContext(Ctx);
