import React, { createContext, useContext, useMemo, useState } from 'react';

const Ctx = createContext(null);

export function OSProvider({ children }) {
  const [wallpaper, setWallpaper] = useState(null);

  const value = useMemo(
    () => ({
      wallpaper,
      setWallpaper,
    }),
    [wallpaper]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useOS = () => useContext(Ctx);
