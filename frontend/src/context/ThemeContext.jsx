import { createContext, useState, useContext, useEffect } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {

    // Check localStorage for saved preference
    // If user set dark mode before, remember it
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark'
    })

    // Every time isDark changes, update the body class and localStorage
    useEffect(() => {
        if (isDark) {
            document.body.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.body.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [isDark])

    const toggleTheme = () => setIsDark(prev => !prev)

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used inside ThemeProvider')
    }
    return context
}

export default ThemeContext