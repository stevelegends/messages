// react
import React, {
    createContext,
    Dispatch,
    ReactElement,
    ReactNode,
    SetStateAction,
    useCallback,
    useContext,
    useMemo,
    useState
} from "react";

// modules
import { ColorSchemeName, useColorScheme } from "react-native";

type ThemeContextType = {
    isDark: boolean;
    isLight: boolean;
    scheme: ColorSchemeName;
    setScheme: Dispatch<SetStateAction<ColorSchemeName>>;
    setToggleScheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function useThemeProvider(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within an ThemeProvider");
    }
    return context;
}

const ThemeProvider = (props: { children: ReactNode }): ReactElement => {
    const colorScheme = useColorScheme();

    const [scheme, setScheme] = useState<ColorSchemeName>(colorScheme);
    const isDark = useMemo(() => scheme === "dark", [scheme]);
    const isLight = useMemo(() => scheme === "light", [scheme]);

    const setToggleScheme = useCallback(() => {
        setScheme(prevState => (prevState === "light" ? "dark" : "light"));
    }, []);

    return (
        <ThemeContext.Provider
            {...props}
            value={{ isDark, isLight, scheme, setScheme, setToggleScheme }}
        />
    );
};

export { ThemeProvider, useThemeProvider };
