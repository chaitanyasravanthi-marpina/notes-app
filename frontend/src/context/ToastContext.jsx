import { createContext, useState, useContext, useCallback } from 'react'

const ToastContext = createContext()

export const ToastProvider = ({ children }) => {

    const [toasts, setToasts] = useState([])

    // Add a new toast
    const showToast = useCallback((message, type = 'success') => {
        // Generate unique id for each toast
        const id = Date.now()

        // Add toast to list
        setToasts(prev => [...prev, { id, message, type }])

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 3000)
    }, [])

    // Remove toast manually
    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast container — fixed position, top right corner */}
            <div style={styles.container}>
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        style={{
                            ...styles.toast,
                            ...(toast.type === 'success' ? styles.success : {}),
                            ...(toast.type === 'error' ? styles.error : {}),
                            ...(toast.type === 'info' ? styles.info : {}),
                        }}
                    >
                        {/* Icon based on type */}
                        <span style={styles.icon}>
                            {toast.type === 'success' && '✅'}
                            {toast.type === 'error' && '❌'}
                            {toast.type === 'info' && 'ℹ️'}
                        </span>

                        {/* Message */}
                        <span style={styles.message}>{toast.message}</span>

                        {/* Close button */}
                        <button
                            onClick={() => removeToast(toast.id)}
                            style={styles.closeBtn}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

        </ToastContext.Provider>
    )
}

// Custom hook — any component calls useToast() to show toasts
export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used inside ToastProvider')
    }
    return context
}

const styles = {
    container: {
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '360px',
        width: '100%',
    },
    toast: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        animation: 'slideIn 0.3s ease',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
    },
    success: {
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
    },
    error: {
        backgroundColor: '#fff0f0',
        border: '1px solid #fca5a5',
    },
    info: {
        backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe',
    },
    icon: {
        fontSize: '18px',
        flexShrink: 0,
    },
    message: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#1a1a1a',
        flex: 1,
        lineHeight: '1.4',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: '#999',
        cursor: 'pointer',
        fontSize: '14px',
        flexShrink: 0,
        padding: '0 4px',
    },
}

export default ToastContext