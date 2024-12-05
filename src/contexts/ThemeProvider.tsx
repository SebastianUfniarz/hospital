import { createContext, useState, useLayoutEffect, PropsWithChildren, useContext, useMemo } from "react";

export type TTheme = "system" | "light" | "dark" | "highContrast";

interface TThemeContext {
    theme: TTheme;
    actualTheme: Omit<TTheme, "system">;
    setTheme: React.Dispatch<React.SetStateAction<TTheme>>;
}

export const getSystemPreferedTheme = (): TTheme => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";

    if (window.matchMedia("(prefers-contrast: forced)").matches
        || window.matchMedia("(forced-colors: active)").matches
    ) return "highContrast";

    return "light";
};

const getPersistedTheme = () => {
    const theme = localStorage.getItem("theme") as TTheme | null;
    return theme ?? getSystemPreferedTheme();
};

export const ThemeContext = createContext<TThemeContext>({
    theme: "system",
    actualTheme: getPersistedTheme(),
    setTheme: () => void 0,
});

const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [theme, setTheme] = useState(getPersistedTheme);

    const actualTheme = useMemo(() => {
        return theme === "system" ? getSystemPreferedTheme() : theme;
    }, [theme]);

    useLayoutEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.className = actualTheme + "Theme";
    }, [theme, actualTheme]);

    return (
        <ThemeContext.Provider value={{ theme, actualTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;
