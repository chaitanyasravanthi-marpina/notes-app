const NoteCard = ({ note, onPin, onArchive, onDelete, onEdit }) => {

    // Format date nicely
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <div style={{
            ...styles.card,
            backgroundColor: note.color || 'var(--bg-secondary)',
            border: note.isPinned
                ? '2px solid var(--accent)'
                : '1px solid var(--border)',
            boxShadow: `0 2px 8px var(--shadow)`,
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

            {/* Footer — date + actions */}
            <div style={styles.footer}>
                <span style={styles.date}>
                    {formatDate(note.createdAt)}
                </span>

                <div style={styles.actions}>

                    {/* Edit button — passes full note object to parent */}
                    <button
                        onClick={() => onEdit(note)}
                        style={styles.actionBtn}
                        title="Edit"
                    >
                        ✏️
                    </button>

                    {/* Pin button */}
                    <button
                        onClick={() => onPin(note._id)}
                        style={styles.actionBtn}
                        title={note.isPinned ? 'Unpin' : 'Pin'}
                    >
                        {note.isPinned ? '📍' : '📌'}
                    </button>

                    {/* Archive button */}
                    <button
                        onClick={() => onArchive(note._id)}
                        style={styles.actionBtn}
                        title="Archive"
                    >
                        🗃️
                    </button>

                    {/* Delete button */}
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
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'default',
    },
    pinnedBadge: {
        fontSize: '11px',
        color: '#4f46e5',
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
        color: '#4f46e5',
        backgroundColor: '#eef2ff',
        padding: '2px 8px',
        borderRadius: '12px',
        fontWeight: '500',
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
        gap: '4px',
    },
    actionBtn: {
        background: 'none',
        border: 'none',
        padding: '4px 6px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
    },
}

export default NoteCard