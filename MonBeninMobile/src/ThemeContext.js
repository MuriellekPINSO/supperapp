import React, { createContext, useContext, useState, useMemo } from "react";
import { darkColors, lightColors } from "./theme";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(true);

    const value = useMemo(
        () => ({
            isDark,
            colors: isDark ? darkColors : lightColors,
            toggleTheme: () => setIsDark((prev) => !prev),
        }),
        [isDark]
    );

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}

export function useAppTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useAppTheme must be used within a ThemeProvider");
    }
    return context;
}
