import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const registerUser = async (userData) => {
  const response = await axios.post(`${BASE_URL}/auth/register`, userData)
  return response.data
}

export const loginUser = async (userData) => {
  const response = await axios.post(`${BASE_URL}/auth/login`, userData)
  return response.data
}