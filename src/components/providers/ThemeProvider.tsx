
import { createContext, useContext, useEffect, useState } from "react"

type ThemeColors = {
  'primary-bg': string
  'secondary-bg': string
  'primary-text': string
  'secondary-text': string
  'primary-border': string
  'secondary-border': string
  'primary-accent': string
  'secondary-accent': string
  'primary-hover': string
  'secondary-hover': string
  'primary-shadow': string
}

type Theme = "light" | "dark" | "custom" | "system"

type PresetTheme = {
  name: string
  colors: ThemeColors
}

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  colors: ThemeColors
  setTheme: (theme: Theme) => void
  setCustomColors: (colors: Partial<ThemeColors>) => void
  presetThemes: PresetTheme[]
  applyPresetTheme: (preset: PresetTheme) => void
}

const lightTheme: ThemeColors = {
  'primary-bg': '0 0% 100%',
  'secondary-bg': '210 40% 96.1%',
  'primary-text': '222.2 84% 4.9%',
  'secondary-text': '215.4 16.3% 46.9%',
  'primary-border': '214.3 31.8% 91.4%',
  'secondary-border': '220 13% 91%',
  'primary-accent': '222.2 47.4% 11.2%',
  'secondary-accent': '210 40% 98%',
  'primary-hover': '222.2 84% 4.9%',
  'secondary-hover': '210 40% 96.1%',
  'primary-shadow': '0 0% 0%'
}

const darkTheme: ThemeColors = {
  'primary-bg': '222.2 84% 4.9%',
  'secondary-bg': '217.2 32.6% 17.5%',
  'primary-text': '210 40% 98%',
  'secondary-text': '215 20.2% 65.1%',
  'primary-border': '217.2 32.6% 17.5%',
  'secondary-border': '240 3.7% 15.9%',
  'primary-accent': '210 40% 98%',
  'secondary-accent': '217.2 32.6% 17.5%',
  'primary-hover': '217.2 32.6% 17.5%',
  'secondary-hover': '240 3.7% 15.9%',
  'primary-shadow': '0 0% 100%'
}

const presetThemes: PresetTheme[] = [
  {
    name: 'Ocean Blue',
    colors: {
      'primary-bg': '210 100% 97%',
      'secondary-bg': '210 40% 92%',
      'primary-text': '210 100% 15%',
      'secondary-text': '210 50% 45%',
      'primary-border': '210 40% 85%',
      'secondary-border': '210 30% 80%',
      'primary-accent': '210 100% 50%',
      'secondary-accent': '210 80% 60%',
      'primary-hover': '210 100% 45%',
      'secondary-hover': '210 70% 55%',
      'primary-shadow': '210 100% 20%'
    }
  },
  {
    name: 'Forest Green',
    colors: {
      'primary-bg': '120 50% 97%',
      'secondary-bg': '120 30% 92%',
      'primary-text': '120 60% 15%',
      'secondary-text': '120 40% 45%',
      'primary-border': '120 30% 85%',
      'secondary-border': '120 25% 80%',
      'primary-accent': '120 60% 40%',
      'secondary-accent': '120 50% 50%',
      'primary-hover': '120 60% 35%',
      'secondary-hover': '120 45% 45%',
      'primary-shadow': '120 60% 20%'
    }
  },
  {
    name: 'Purple Passion',
    colors: {
      'primary-bg': '270 50% 97%',
      'secondary-bg': '270 30% 92%',
      'primary-text': '270 70% 15%',
      'secondary-text': '270 40% 45%',
      'primary-border': '270 30% 85%',
      'secondary-border': '270 25% 80%',
      'primary-accent': '270 70% 50%',
      'secondary-accent': '270 60% 60%',
      'primary-hover': '270 70% 45%',
      'secondary-hover': '270 55% 55%',
      'primary-shadow': '270 70% 20%'
    }
  },
  {
    name: 'Sunset Orange',
    colors: {
      'primary-bg': '30 100% 97%',
      'secondary-bg': '30 60% 92%',
      'primary-text': '30 80% 15%',
      'secondary-text': '30 50% 45%',
      'primary-border': '30 40% 85%',
      'secondary-border': '30 35% 80%',
      'primary-accent': '30 100% 50%',
      'secondary-accent': '30 80% 60%',
      'primary-hover': '30 100% 45%',
      'secondary-hover': '30 75% 55%',
      'primary-shadow': '30 80% 20%'
    }
  }
]

const initialState: ThemeProviderState = {
  theme: "light",
  colors: lightTheme,
  setTheme: () => null,
  setCustomColors: () => null,
  presetThemes,
  applyPresetTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "component-library-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  
  const [colors, setColors] = useState<ThemeColors>(() => {
    const savedColors = localStorage.getItem(`${storageKey}-colors`)
    if (savedColors) {
      return JSON.parse(savedColors)
    }
    return theme === "dark" ? darkTheme : lightTheme
  })

  const applyColorsToDOM = (themeColors: ThemeColors) => {
    const root = window.document.documentElement
    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })
  }

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark", "custom")

    if (theme === "custom") {
      root.classList.add("custom")
      applyColorsToDOM(colors)
    } else if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      const themeColors = systemTheme === "dark" ? darkTheme : lightTheme
      setColors(themeColors)
      applyColorsToDOM(themeColors)
      root.classList.add(systemTheme)
    } else {
      const themeColors = theme === "dark" ? darkTheme : lightTheme
      setColors(themeColors)
      applyColorsToDOM(themeColors)
      root.classList.add(theme)
    }
  }, [theme, colors])

  const handleSetTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme)
    setTheme(newTheme)
  }

  const handleSetCustomColors = (newColors: Partial<ThemeColors>) => {
    const updatedColors = { ...colors, ...newColors }
    setColors(updatedColors)
    localStorage.setItem(`${storageKey}-colors`, JSON.stringify(updatedColors))
    if (theme !== "custom") {
      setTheme("custom")
      localStorage.setItem(storageKey, "custom")
    }
  }

  const handleApplyPresetTheme = (preset: PresetTheme) => {
    setColors(preset.colors)
    setTheme("custom")
    localStorage.setItem(storageKey, "custom")
    localStorage.setItem(`${storageKey}-colors`, JSON.stringify(preset.colors))
  }

  const value = {
    theme,
    colors,
    setTheme: handleSetTheme,
    setCustomColors: handleSetCustomColors,
    presetThemes,
    applyPresetTheme: handleApplyPresetTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
