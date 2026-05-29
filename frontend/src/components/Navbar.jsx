import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav style={styles.nav}>
            <div style={styles.inner}>

                {/* Logo */}
                <h1 style={styles.logo}>📝 NotesApp</h1>

                {/* Right side — user info + logout */}
                <div style={styles.right}>
                    <span style={styles.username}>
                        👤 {user?.name}
                    </span>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Logout
                    </button>
                </div>

            </div>
        </nav>
    )
}

const styles = {
    nav: {
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 24px',
        height: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
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
        color: '#4f46e5',
    },
    right: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    username: {
        fontSize: '14px',
        color: '#555',
        fontWeight: '500',
    },
    logoutBtn: {
        padding: '8px 16px',
        backgroundColor: 'transparent',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#555',
        cursor: 'pointer',
    },
}

export default Navbar