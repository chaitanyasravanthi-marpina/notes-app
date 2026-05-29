import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../api/authApi'

const LoginPage = () => {
    // Form state
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // UI state
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Hooks
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()    // stop page refresh on form submit
        setError('')           // clear previous errors
        setLoading(true)

        try {
            // Call our api function — talks to backend
            const data = await loginUser({ email, password })

            // Save user and token to AuthContext + localStorage
            login(data.user, data.token)

            // Redirect to dashboard
            navigate('/dashboard')

        } catch (err) {
            // Show error message from backend
            setError(err.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>

                {/* Header */}
                <div style={styles.header}>
                    <h1 style={styles.logo}>📝 NotesApp</h1>
                    <h2 style={styles.title}>Welcome back</h2>
                    <p style={styles.subtitle}>Sign in to your account</p>
                </div>

                {/* Error message */}
                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} style={styles.form}>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={loading ? styles.buttonDisabled : styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                </form>

                {/* Footer */}
                <p style={styles.footer}>
                    Don't have an account?{' '}
                    <Link to="/register" style={styles.link}>
                        Create one
                    </Link>
                </p>

            </div>
        </div>
    )
}

// Styles object — inline styles keep everything in one file for now
const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f2f5',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '420px',
    },
    header: {
        textAlign: 'center',
        marginBottom: '32px',
    },
    logo: {
        fontSize: '32px',
        marginBottom: '16px',
    },
    title: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: '8px',
    },
    subtitle: {
        fontSize: '14px',
        color: '#666',
    },
    error: {
        backgroundColor: '#fff0f0',
        color: '#e53e3e',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '14px',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    label: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#333',
    },
    input: {
        padding: '12px 16px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '15px',
        transition: 'border 0.2s',
        fontFamily: 'inherit',
    },
    button: {
        padding: '13px',
        backgroundColor: '#4f46e5',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '4px',
    },
    buttonDisabled: {
        padding: '13px',
        backgroundColor: '#a5b4fc',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'not-allowed',
        marginTop: '4px',
    },
    footer: {
        textAlign: 'center',
        marginTop: '24px',
        fontSize: '14px',
        color: '#666',
    },
    link: {
        color: '#4f46e5',
        fontWeight: '600',
    },
}

export default LoginPage