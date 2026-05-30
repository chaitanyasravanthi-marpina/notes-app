import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const { user, logout } = useAuth()
    const { isDark, toggleTheme } = useTheme()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav style={{
            ...styles.nav,
            backgroundColor: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border)',
            boxShadow: `0 1px 3px var(--shadow)`,
        }}>
            <div style={styles.inner}>

                {/* Logo */}
                <h1 style={{ ...styles.logo, color: 'var(--accent)' }}>
                    📝 NotesApp
                </h1>

                {/* Right side */}
                <div style={styles.right}>

                    {/* Dark mode toggle */}
                    <button
                        onClick={toggleTheme}
                        style={{
                            ...styles.themeBtn,
                            backgroundColor: 'var(--bg-tertiary)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)',
                        }}
                        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDark ? '☀️ Light' : '🌙 Dark'}
                    </button>

                    {/* Username */}
                    <span style={{ ...styles.username, color: 'var(--text-secondary)' }}>
                        👤 {user?.name}
                    </span>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        style={{
                            ...styles.logoutBtn,
                            border: '1px solid var(--border)',
                            color: 'var(--text-secondary)',
                        }}
                    >
                        Logout
                    </button>

                </div>
            </div>
        </nav>
    )
}

const styles = {
    nav: {
        padding: '0 24px',
        height: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    inner: {
        maxWidth: '1200px',
        margin: '0 auto',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo: {
        fontSize: '22px',
        fontWeight: '700',
    },
    right: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    themeBtn: {
        padding: '8px 14px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
    },
    username: {
        fontSize: '14px',
        fontWeight: '500',
    },
    logoutBtn: {
        padding: '8px 16px',
        backgroundColor: 'transparent',
        borderRadius: '8px',
        fontSize: '14px',
        cursor: 'pointer',
    },
}

export default Navbar