import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { registerUser } from '../api/authApi'

const RegisterPage = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        // Basic frontend validation
        if (password.length < 6) {
            return setError('Password must be at least 6 characters')
        }

        setLoading(true)

        try {
            const data = await registerUser({ name, email, password })

            // Auto login after register
            login(data.user, data.token)
            navigate('/dashboard')

        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>

                <div style={styles.header}>
                    <h1 style={styles.logo}>📝 NotesApp</h1>
                    <h2 style={styles.title}>Create account</h2>
                    <p style={styles.subtitle}>Start organizing your thoughts</p>
                </div>

                {error && (
                    <div style={styles.error}>{error}</div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

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
                            placeholder="Minimum 6 characters"
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
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>

                </form>

                <p style={styles.footer}>
                    Already have an account?{' '}
                    <Link to="/login" style={styles.link}>
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
    )
}

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

export default RegisterPage