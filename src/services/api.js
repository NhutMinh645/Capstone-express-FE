import axios from 'axios'
import useAuth from '../store/auth'

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3069'

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false
})

api.interceptors.request.use((config) => {
  const { token } = useAuth.getState()
  if(token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.message || err?.message || 'Request error'
    console.error('[API ERROR]', msg)
    throw err
  }
)

export default api
