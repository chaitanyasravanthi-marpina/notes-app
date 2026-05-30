import { useState } from 'react'

// Color palette — carefully chosen colors that work in both light and dark mode
const COLORS = [
    { value: '#ffffff', label: 'White' },
    { value: '#fef9c3', label: 'Yellow' },
    { value: '#dcfce7', label: 'Green' },
    { value: '#dbeafe', label: 'Blue' },
    { value: '#fce7f3', label: 'Pink' },
    { value: '#ede9fe', label: 'Purple' },
    { value: '#ffedd5', label: 'Orange' },
    { value: '#f1f5f9', label: 'Gray' },
]

const NoteCard = ({ note, onPin, onArchive, onDelete, onEdit, onColorChange }) => {
    const [showColors, setShowColors] = useState(false)

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const handleColorSelect = (color) => {
        onColorChange(note._id, color)
        setShowColors(false)
    }

    return (
        <div style={{
            ...styles.card,
            backgroundColor: note.color || '#ffffff',
            border: note.isPinned
                ? '2px solid var(--accent)'
                : '1px solid var(--border)',
            boxShadow: `0 2px 8px var(--shadow)`,
            position: 'relative',
        }}>

            {/* Pin indicator */}
            {note.isPinned && (
                <span style={styles.pinnedBadge}>📌 Pinned</span>
            )}

            {/* Note title */}
            <h3 style={styles.title}>{note.title}</h3>

            {/* Note content */}
            {note.content && (
                <p style={styles.content}>
                    {note.content.length > 120
                        ? note.content.substring(0, 120) + '...'
                        : note.content
                    }
                </p>
            )}

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
                <div style={styles.tags}>
                    {note.tags.map((tag, index) => (
                        <span key={index} style={styles.tag}>
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Color palette — shows when palette button clicked */}
            {showColors && (
                <div style={styles.colorPalette}>
                    {COLORS.map(color => (
                        <button
                            key={color.value}
                            onClick={() => handleColorSelect(color.value)}
                            title={color.label}
                            style={{
                                ...styles.colorDot,
                                backgroundColor: color.value,
                                border: note.color === color.value
                                    ? '2px solid var(--accent)'
                                    : '2px solid var(--border)',
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Footer — date + actions */}
            <div style={styles.footer}>
                <span style={styles.date}>
                    {formatDate(note.createdAt)}
                </span>

                <div style={styles.actions}>

                    {/* Edit */}
                    <button
                        onClick={() => onEdit(note)}
                        style={styles.actionBtn}
                        title="Edit"
                    >
                        ✏️
                    </button>

                    {/* Color picker toggle */}
                    <button
                        onClick={() => setShowColors(prev => !prev)}
                        style={styles.actionBtn}
                        title="Change color"
                    >
                        🎨
                    </button>

                    {/* Pin */}
                    <button
                        onClick={() => onPin(note._id)}
                        style={styles.actionBtn}
                        title={note.isPinned ? 'Unpin' : 'Pin'}
                    >
                        {note.isPinned ? '📍' : '📌'}
                    </button>

                    {/* Archive */}
                    <button
                        onClick={() => onArchive(note._id)}
                        style={styles.actionBtn}
                        title="Archive"
                    >
                        🗃️
                    </button>

                    {/* Delete */}
                    <button
                        onClick={() => onDelete(note._id)}
                        style={styles.actionBtn}
                        title="Move to trash"
                    >
                        🗑️
                    </button>

                </div>
            </div>

        </div>
    )
}

const styles = {
    card: {
        padding: '20px',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'default',
    },
    pinnedBadge: {
        fontSize: '11px',
        color: 'var(--accent)',
        fontWeight: '600',
    },
    title: {
        fontSize: '16px',
        fontWeight: '600',
        color: 'var(--text-primary)',
        lineHeight: '1.4',
    },
    content: {
        fontSize: '14px',
        color: 'var(--text-secondary)',
        lineHeight: '1.6',
    },
    tags: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
    },
    tag: {
        fontSize: '12px',
        color: 'var(--accent)',
        backgroundColor: 'var(--accent-light)',
        padding: '2px 8px',
        borderRadius: '12px',
        fontWeight: '500',
    },
    colorPalette: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '10px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '10px',
        border: '1px solid var(--border)',
    },
    colorDot: {
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        cursor: 'pointer',
        transition: 'transform 0.15s',
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '4px',
    },
    date: {
        fontSize: '12px',
        color: 'var(--text-muted)',
    },
    actions: {
        display: 'flex',
        gap: '2px',
    },
    actionBtn: {
        background: 'none',
        border: 'none',
        padding: '4px 6px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '15px',
    },
}

export default NoteCard