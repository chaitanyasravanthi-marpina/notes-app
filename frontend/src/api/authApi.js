import axios from 'axios'

// Base URL of your backend
const BASE_URL = 'http://localhost:5000/api'

export const registerUser = async (userData) => {
  const response = await axios.post(`${BASE_URL}/auth/register`, userData)
  return response.data
}

export const loginUser = async (userData) => {
  const response = await axios.post(`${BASE_URL}/auth/login`, userData)
  return response.data
}