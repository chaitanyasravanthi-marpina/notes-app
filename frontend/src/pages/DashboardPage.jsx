import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Navbar from '../components/Navbar'
import NoteCard from '../components/NoteCard'
import EditNoteModal from '../components/EditNoteModal'
import {
    getNotes,
    createNote,
    deleteNote,
    togglePin,
    toggleArchive,
    getTrashedNotes,
    restoreNote,
    permanentDeleteNote,
    getArchivedNotes,
    updateNote
} from '../api/notesApi'

const DashboardPage = () => {
    const { token } = useAuth()
    const { showToast } = useToast()

    const [notes, setNotes] = useState([])
    const [archivedNotes, setArchivedNotes] = useState([])
    const [trashedNotes, setTrashedNotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [activeTab, setActiveTab] = useState('notes')
    const [editingNote, setEditingNote] = useState(null)
    const [newTitle, setNewTitle] = useState('')
    const [newContent, setNewContent] = useState('')
    const [newTags, setNewTags] = useState('')
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        fetchAllNotes()
    }, [])

    const fetchAllNotes = async () => {
        try {
            setLoading(true)
            const [notesData, trashData, archiveData] = await Promise.all([
                getNotes(token),
                getTrashedNotes(token),
                getArchivedNotes(token)
            ])
            setNotes(notesData.notes)
            setTrashedNotes(trashData.notes)
            setArchivedNotes(archiveData.notes)
        } catch (err) {
            showToast('Failed to load notes', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async (e) => {
        e.preventDefault()
        if (!newTitle.trim()) return
        setCreating(true)
        try {
            const tagsArray = newTags
                .split(',')
                .map(t => t.trim())
                .filter(t => t !== '')
            const data = await createNote(
                { title: newTitle, content: newContent, tags: tagsArray },
                token
            )
            setNotes(prev => [data.note, ...prev])
            setNewTitle('')
            setNewContent('')
            setNewTags('')
            setShowForm(false)
            showToast('Note created successfully')
        } catch (err) {
            showToast('Failed to create note', 'error')
        } finally {
            setCreating(false)
        }
    }

    const handlePin = async (id) => {
        try {
            const data = await togglePin(id, token)
            setNotes(prev => prev.map(note =>
                note._id === id
                    ? { ...note, isPinned: data.isPinned }
                    : note
            ))
            showToast(data.isPinned ? 'Note pinned' : 'Note unpinned')
        } catch (err) {
            showToast('Failed to pin note', 'error')
        }
    }

    const handleArchive = async (id) => {
        try {
            await toggleArchive(id, token)
            const note = notes.find(n => n._id === id)
            setNotes(prev => prev.filter(n => n._id !== id))
            if (note) {
                setArchivedNotes(prev => [{ ...note, isArchived: true }, ...prev])
            }
            showToast('Note archived')
        } catch (err) {
            showToast('Failed to archive note', 'error')
        }
    }

    const handleUnarchive = async (id) => {
        try {
            await toggleArchive(id, token)
            const note = archivedNotes.find(n => n._id === id)
            setArchivedNotes(prev => prev.filter(n => n._id !== id))
            if (note) {
                setNotes(prev => [{ ...note, isArchived: false }, ...prev])
            }
            showToast('Note unarchived')
        } catch (err) {
            showToast('Failed to unarchive note', 'error')
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteNote(id, token)
            const note = notes.find(n => n._id === id)
            setNotes(prev => prev.filter(n => n._id !== id))
            if (note) {
                setTrashedNotes(prev => [
                    { ...note, isDeleted: true, deletedAt: new Date() },
                    ...prev
                ])
            }
            showToast('Note moved to trash')
        } catch (err) {
            showToast('Failed to delete note', 'error')
        }
    }

    const handleUpdate = async (id, updatedData) => {
        try {
            const data = await updateNote(id, updatedData, token)
            setNotes(prev => prev.map(note =>
                note._id === id
                    ? { ...note, ...data.note }
                    : note
            ))
            showToast('Note updated successfully')
        } catch (err) {
            showToast('Failed to update note', 'error')
        }
    }

    const handleRestore = async (id) => {
        try {
            await restoreNote(id, token)
            const note = trashedNotes.find(n => n._id === id)
            setTrashedNotes(prev => prev.filter(n => n._id !== id))
            if (note) {
                setNotes(prev => [
                    { ...note, isDeleted: false, deletedAt: null, isArchived: false },
                    ...prev
                ])
            }
            showToast('Note restored successfully')
        } catch (err) {
            showToast('Failed to restore note', 'error')
        }
    }

    const handlePermanentDelete = async (id) => {
        try {
            await permanentDeleteNote(id, token)
            setTrashedNotes(prev => prev.filter(n => n._id !== id))
            showToast('Note permanently deleted', 'info')
        } catch (err) {
            showToast('Failed to delete note', 'error')
        }
    }

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase())
    )

    const pinnedNotes = filteredNotes.filter(n => n.isPinned)
    const unpinnedNotes = filteredNotes.filter(n => !n.isPinned)

    return (
        <div style={styles.page}>
            <Navbar />

            <div style={styles.container}>

                {/* Tabs */}
                <div style={styles.tabs}>
                    <button
                        onClick={() => setActiveTab('notes')}
                        style={activeTab === 'notes' ? styles.tabActive : styles.tab}
                    >
                        📝 Notes {notes.length > 0 && `(${notes.length})`}
                    </button>
                    <button
                        onClick={() => setActiveTab('archive')}
                        style={activeTab === 'archive' ? styles.tabActive : styles.tab}
                    >
                        🗃️ Archive {archivedNotes.length > 0 && `(${archivedNotes.length})`}
                    </button>
                    <button
                        onClick={() => setActiveTab('trash')}
                        style={activeTab === 'trash' ? styles.tabActive : styles.tab}
                    >
                        🗑️ Trash {trashedNotes.length > 0 && `(${trashedNotes.length})`}
                    </button>
                </div>

                {/* Search + Create */}
                {activeTab === 'notes' && (
                    <div style={styles.toolbar}>
                        <input
                            type="text"
                            placeholder="🔍 Search notes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={styles.searchInput}
                        />
                        <button
                            onClick={() => setShowForm(!showForm)}
                            style={styles.newNoteBtn}
                        >
                            {showForm ? '✕ Cancel' : '+ New Note'}
                        </button>
                    </div>
                )}

                {/* Create note form */}
                {activeTab === 'notes' && showForm && (
                    <form onSubmit={handleCreate} style={styles.form}>
                        <input
                            type="text"
                            placeholder="Note title *"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            style={styles.formInput}
                            required
                        />
                        <textarea
                            placeholder="Note content..."
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            style={styles.formTextarea}
                            rows={4}
                        />
                        <input
                            type="text"
                            placeholder="Tags (comma separated): work, personal"
                            value={newTags}
                            onChange={(e) => setNewTags(e.target.value)}
                            style={styles.formInput}
                        />
                        <button
                            type="submit"
                            style={creating ? styles.btnDisabled : styles.createBtn}
                            disabled={creating}
                        >
                            {creating ? 'Creating...' : 'Create Note'}
                        </button>
                    </form>
                )}

                {/* Content */}
                {loading ? (
                    <div style={styles.center}>Loading notes...</div>
                ) : (
                    <div>

                        {/* ── NOTES TAB ── */}
                        {activeTab === 'notes' && (
                            <div>
                                {pinnedNotes.length > 0 && (
                                    <div style={styles.section}>
                                        <h3 style={styles.sectionTitle}>📌 Pinned</h3>
                                        <div style={styles.grid}>
                                            {pinnedNotes.map(note => (
                                                <NoteCard
                                                    key={note._id}
                                                    note={note}
                                                    onPin={handlePin}
                                                    onArchive={handleArchive}
                                                    onDelete={handleDelete}
                                                    onEdit={setEditingNote}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {unpinnedNotes.length > 0 && (
                                    <div style={styles.section}>
                                        {pinnedNotes.length > 0 && (
                                            <h3 style={styles.sectionTitle}>All Notes</h3>
                                        )}
                                        <div style={styles.grid}>
                                            {unpinnedNotes.map(note => (
                                                <NoteCard
                                                    key={note._id}
                                                    note={note}
                                                    onPin={handlePin}
                                                    onArchive={handleArchive}
                                                    onDelete={handleDelete}
                                                    onEdit={setEditingNote}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {filteredNotes.length === 0 && (
                                    <div style={styles.empty}>
                                        <p style={styles.emptyIcon}>📝</p>
                                        <p style={styles.emptyText}>
                                            {search
                                                ? 'No notes match your search'
                                                : 'No notes yet. Create your first note!'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── ARCHIVE TAB ── */}
                        {activeTab === 'archive' && (
                            <div>
                                {archivedNotes.length === 0 ? (
                                    <div style={styles.empty}>
                                        <p style={styles.emptyIcon}>🗃️</p>
                                        <p style={styles.emptyText}>No archived notes</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p style={styles.tabHint}>
                                            Click 🗃️ on a note to unarchive it
                                        </p>
                                        <div style={styles.grid}>
                                            {archivedNotes.map(note => (
                                                <NoteCard
                                                    key={note._id}
                                                    note={note}
                                                    onPin={handlePin}
                                                    onArchive={handleUnarchive}
                                                    onDelete={handleDelete}
                                                    onEdit={setEditingNote}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── TRASH TAB ── */}
                        {activeTab === 'trash' && (
                            <div>
                                {trashedNotes.length === 0 ? (
                                    <div style={styles.empty}>
                                        <p style={styles.emptyIcon}>🗑️</p>
                                        <p style={styles.emptyText}>Trash is empty</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p style={styles.tabHint}>
                                            Notes in trash are permanently deleted after 30 days
                                        </p>
                                        <div style={styles.grid}>
                                            {trashedNotes.map(note => (
                                                <div key={note._id} style={styles.trashCard}>
                                                    <h3 style={styles.trashTitle}>{note.title}</h3>
                                                    {note.content && (
                                                        <p style={styles.trashContent}>
                                                            {note.content.length > 80
                                                                ? note.content.substring(0, 80) + '...'
                                                                : note.content}
                                                        </p>
                                                    )}
                                                    <div style={styles.trashActions}>
                                                        <button
                                                            onClick={() => handleRestore(note._id)}
                                                            style={styles.restoreBtn}
                                                        >
                                                            ↩️ Restore
                                                        </button>
                                                        <button
                                                            onClick={() => handlePermanentDelete(note._id)}
                                                            style={styles.permDeleteBtn}
                                                        >
                                                            🗑️ Delete Forever
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                )}

            </div>

            {/* Edit Modal */}
            <EditNoteModal
                note={editingNote}
                onSave={handleUpdate}
                onClose={() => setEditingNote(null)}
            />

        </div>
    )
}

const styles = {
    // Find these in styles object and update:
    page: {
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',  // ← was #f0f2f5
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px',
    },
    tabs: {
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
    },
    tab: {
        padding: '10px 20px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '500',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
    },
    tabActive: {
        padding: '10px 20px',
        backgroundColor: '#4f46e5',
        border: '1px solid #4f46e5',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#ffffff',
        cursor: 'pointer',
    },
    toolbar: {
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
    },
    searchInput: {
        flex: 1,
        padding: '12px 16px',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        fontSize: '15px',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        fontFamily: 'inherit',
    },
    newNoteBtn: {
        padding: '12px 20px',
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
    },
    form: {
        backgroundColor: 'var(--bg-secondary)',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: `0 2px 8px var(--shadow)`,
    },
    formInput: {
        padding: '12px 16px',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        fontSize: '15px',
        fontFamily: 'inherit',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
    },
    formTextarea: {
        padding: '12px 16px',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        fontSize: '15px',
        fontFamily: 'inherit',
        resize: 'vertical',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
    },
    createBtn: {
        padding: '12px',
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    btnDisabled: {
        padding: '12px',
        backgroundColor: '#a5b4fc',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'not-allowed',
    },
    center: {
        textAlign: 'center',
        padding: '60px',
        color: '#999',
    },
    section: {
        marginBottom: '32px',
    },
    sectionTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '16px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
    },
    empty: {
        textAlign: 'center',
        padding: '80px 20px',
    },
    emptyIcon: {
        fontSize: '48px',
        marginBottom: '16px',
    },
    emptyText: {
        fontSize: '16px',
        color: '#999',
    },
    tabHint: {
        fontSize: '13px',
        color: '#999',
        marginBottom: '16px',
        fontStyle: 'italic',
    },
    trashCard: {
        backgroundColor: 'var(--bg-secondary)',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    trashTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#999',
        textDecoration: 'line-through',
    },
    trashContent: {
        fontSize: '14px',
        color: '#bbb',
    },
    trashActions: {
        display: 'flex',
        gap: '8px',
        marginTop: '4px',
    },
    restoreBtn: {
        padding: '8px 14px',
        backgroundColor: '#ecfdf5',
        color: '#059669',
        border: '1px solid #6ee7b7',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    permDeleteBtn: {
        padding: '8px 14px',
        backgroundColor: '#fff0f0',
        color: '#e53e3e',
        border: '1px solid #fca5a5',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
    },
}

export default DashboardPage