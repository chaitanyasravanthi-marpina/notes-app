import axios from 'axios'

const BASE_URL = 'http://localhost:5000/api'

// Helper — builds headers with token automatically
const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
})

export const createNote = async (noteData, token) => {
  const response = await axios.post(
    `${BASE_URL}/notes`,
    noteData,
    authHeaders(token)
  )
  return response.data
}

export const getNotes = async (token, params = {}) => {
  const response = await axios.get(
    `${BASE_URL}/notes`,
    { ...authHeaders(token), params }
  )
  return response.data
}

export const updateNote = async (id, noteData, token) => {
  const response = await axios.put(
    `${BASE_URL}/notes/${id}`,
    noteData,
    authHeaders(token)
  )
  return response.data
}

export const deleteNote = async (id, token) => {
  const response = await axios.delete(
    `${BASE_URL}/notes/${id}`,
    authHeaders(token)
  )
  return response.data
}

export const togglePin = async (id, token) => {
  const response = await axios.put(
    `${BASE_URL}/notes/${id}/pin`,
    {},
    authHeaders(token)
  )
  return response.data
}

export const toggleArchive = async (id, token) => {
  const response = await axios.put(
    `${BASE_URL}/notes/${id}/archive`,
    {},
    authHeaders(token)
  )
  return response.data
}

export const getTrashedNotes = async (token) => {
  const response = await axios.get(
    `${BASE_URL}/notes/trash`,
    authHeaders(token)
  )
  return response.data
}

export const restoreNote = async (id, token) => {
  const response = await axios.put(
    `${BASE_URL}/notes/${id}/restore`,
    {},
    authHeaders(token)
  )
  return response.data
}

export const permanentDeleteNote = async (id, token) => {
  const response = await axios.delete(
    `${BASE_URL}/notes/${id}/permanent`,
    authHeaders(token)
  )
  return response.data
}
export const getArchivedNotes = async (token) => {
  const response = await axios.get(
    `${BASE_URL}/notes/archived`,
    authHeaders(token)
  )
  return response.data
}
export const changeNoteColor = async (id, color, token) => {
  const response = await axios.put(
    `${BASE_URL}/notes/${id}`,
    { color },
    authHeaders(token)
  )
  return response.data
}