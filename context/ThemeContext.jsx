// ThemeContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
  } from "react";
  import { Appearance, useColorScheme } from "react-native";
  import { lightColors, darkColors } from "../utils/colors";
  import { MMKV } from "react-native-mmkv";
  
  const storage = new MMKV();
  
  export const ThemeContext = createContext({
    isDark: false,
    colors: lightColors,
    toggleTheme: () => {},
    isSystemTheme: true,
  });
  
  export const ThemeProvider = ({ children }) => {
    const systemTheme = useColorScheme();
    const [isDark, setIsDark] = useState(systemTheme === "dark");
    const [isSystemTheme, setIsSystemTheme] = useState(true);
  
    // Load saved theme from MMKV
    useEffect(() => {
      const savedTheme = storage.getString("theme");
  
      if (savedTheme === "dark") {
        setIsDark(true);
        setIsSystemTheme(false);
      } else if (savedTheme === "light") {
        setIsDark(false);
        setIsSystemTheme(false);
      } else {
        setIsDark(systemTheme === "dark");
        setIsSystemTheme(true);
      }
    }, []);
  
    // Listen to system theme changes when using system theme
    useEffect(() => {
      if (isSystemTheme) {
        setIsDark(systemTheme === "dark");
      }
    }, [systemTheme, isSystemTheme]);
  
    // Save theme preference in MMKV
    useEffect(() => {
      const themeValue = isSystemTheme ? "system" : isDark ? "dark" : "light";
      storage.set("theme", themeValue);
    }, [isDark, isSystemTheme]);
  
    const toggleTheme = useCallback(() => {
      if (isSystemTheme) {
        setIsSystemTheme(false);
        setIsDark(systemTheme !== "dark");
      } else {
        setIsDark((prev) => !prev);
      }
    }, [isSystemTheme, systemTheme]);
  
    const colors = isDark ? darkColors : lightColors;
  
    return (
      <ThemeContext.Provider
        value={{ isDark, colors, toggleTheme, isSystemTheme }}
      >
        {children}
      </ThemeContext.Provider>
    );
  };
  
//   export const useTheme = () => {
//     const context = useContext(ThemeContext);
//     if (!context) {
//       throw new Error("useTheme must be used within a ThemeProvider");
//     }
//     return context;
//   };
  