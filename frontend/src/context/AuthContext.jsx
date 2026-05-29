import { createContext, useState, useContext, useEffect } from 'react'

// Step 1: Create the context object
// Think of this as creating a "channel" that any component can tune into
const AuthContext = createContext()

// Step 2: Create the Provider component
// This wraps your entire app and makes auth data available everywhere
export const AuthProvider = ({ children }) => {

    // User state — stores the logged in user's data
    const [user, setUser] = useState(null)

    // Token state — stores the JWT token
    const [token, setToken] = useState(null)

    // Loading state — true while we check localStorage on app start
    const [loading, setLoading] = useState(true)

    // Step 3: On app start, check if user was previously logged in
    // If they refresh the page, we don't want them to be logged out
    useEffect(() => {
        const savedToken = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')

        if (savedToken && savedUser) {
            setToken(savedToken)
            setUser(JSON.parse(savedUser))
        }

        // Done checking — set loading to false
        setLoading(false)
    }, [])

    // Step 4: Login function
    // Called after successful login API response
    const login = (userData, userToken) => {
        setUser(userData)
        setToken(userToken)

        // Save to localStorage so user stays logged in after refresh
        localStorage.setItem('token', userToken)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    // Step 5: Logout function
    const logout = () => {
        setUser(null)
        setToken(null)

        // Remove from localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    // Step 6: Value object — everything we share with the app
    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token   // true if token exists, false if null
    }

    return (
        <AuthContext.Provider value={value}>
            {/* Don't render children until we've checked localStorage */}
            {!loading && children}
        </AuthContext.Provider>
    )
}

// Step 7: Custom hook for easy access
// Instead of writing useContext(AuthContext) everywhere,
// any component just writes: const { user, login } = useAuth()
export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider')
    }

    return context
}

export default AuthContext