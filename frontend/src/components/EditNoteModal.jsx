import { useState, useEffect } from 'react'

const EditNoteModal = ({ note, onSave, onClose }) => {

    // Pre-fill form with existing note data
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState('')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    // When note changes, update form fields
    // useEffect watches 'note' — runs when note prop changes
    useEffect(() => {
        if (note) {
            setTitle(note.title)
            setContent(note.content || '')
            setTags(note.tags ? note.tags.join(', ') : '')
        }
    }, [note])

    // Handle save
    const handleSave = async () => {
        if (!title.trim()) {
            setError('Title is required')
            return
        }

        setSaving(true)
        setError('')

        try {
            // Convert tags string back to array
            const tagsArray = tags
                .split(',')
                .map(t => t.trim())
                .filter(t => t !== '')

            // Call onSave function passed from parent
            await onSave(note._id, {
                title,
                content,
                tags: tagsArray
            })

            // Close modal after successful save
            onClose()

        } catch (err) {
            setError('Failed to save note')
        } finally {
            setSaving(false)
        }
    }

    // Close modal when clicking the dark overlay behind it
    const handleOverlayClick = (e) => {
        // e.target = what you clicked
        // e.currentTarget = the overlay div itself
        // Only close if you clicked the overlay, not the modal card
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    // If no note passed, render nothing
    if (!note) return null

    return (
        // Overlay — dark background behind modal
        <div style={styles.overlay} onClick={handleOverlayClick}>

            {/* Modal card */}
            <div style={styles.modal}>

                {/* Header */}
                <div style={styles.header}>
                    <h2 style={styles.headerTitle}>Edit Note</h2>
                    <button onClick={onClose} style={styles.closeBtn}>
                        ✕
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div style={styles.error}>{error}</div>
                )}

                {/* Form fields */}
                <div style={styles.body}>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={styles.input}
                            placeholder="Note title"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={styles.textarea}
                            placeholder="Note content..."
                            rows={6}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Tags</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            style={styles.input}
                            placeholder="work, personal, ideas"
                        />
                        <span style={styles.hint}>Separate tags with commas</span>
                    </div>

                </div>

                {/* Footer — action buttons */}
                <div style={styles.footer}>
                    <button onClick={onClose} style={styles.cancelBtn}>
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        style={saving ? styles.saveBtnDisabled : styles.saveBtn}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

            </div>
        </div>
    )
}

const styles = {
    overlay: {
        // Covers entire screen
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // Dark transparent background
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        // Centers the modal card
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Sits on top of everything
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '520px',
        margin: '0 20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        // Prevent clicks inside modal from closing it
        overflow: 'hidden',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 24px',
        borderBottom: '1px solid #e5e7eb',
    },
    headerTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#1a1a1a',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        fontSize: '18px',
        color: '#999',
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: '6px',
    },
    error: {
        backgroundColor: '#fff0f0',
        color: '#e53e3e',
        padding: '12px 24px',
        fontSize: '14px',
    },
    body: {
        padding: '24px',
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
        fontWeight: '600',
        color: '#333',
    },
    input: {
        padding: '12px 16px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '15px',
        fontFamily: 'inherit',
    },
    textarea: {
        padding: '12px 16px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '15px',
        fontFamily: 'inherit',
        resize: 'vertical',
        lineHeight: '1.6',
    },
    hint: {
        fontSize: '12px',
        color: '#999',
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        padding: '16px 24px',
        borderTop: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
    },
    cancelBtn: {
        padding: '10px 20px',
        backgroundColor: 'transparent',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#666',
        cursor: 'pointer',
    },
    saveBtn: {
        padding: '10px 20px',
        backgroundColor: '#4f46e5',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#ffffff',
        cursor: 'pointer',
    },
    saveBtnDisabled: {
        padding: '10px 20px',
        backgroundColor: '#a5b4fc',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#ffffff',
        cursor: 'not-allowed',
    },
}

export default EditNoteModal