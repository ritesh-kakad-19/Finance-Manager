import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext({
  darkMode: true,
  setDarkMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("financely-theme");
    if (stored === "light") return false;
    if (stored === "dark") return true;
    return localStorage.getItem("darkMode") !== "false";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.classList.toggle("light", !darkMode);
    localStorage.setItem("financely-theme", darkMode ? "dark" : "light");
    localStorage.setItem("darkMode", darkMode ? "true" : "false");
  }, [darkMode]);

  const value = useMemo(() => ({ darkMode, setDarkMode }), [darkMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
