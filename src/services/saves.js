import api from './api'
import useAuth from '../store/auth'

// Kiểm tra đã lưu: đúng endpoint của BE
export const checkSaved = async (imageId) => {
  const { token } = useAuth.getState()
  if (!token) return false
  try {
    const r = await api.get(`/images/${imageId}/saved`)
    return !!r.data?.saved
  } catch {
    // Nếu BE trả 404 => coi như chưa lưu
    return false
  }
}

// Toggle lưu/huỷ lưu: đúng endpoint của BE
export const toggleSave = async (imageId) => {
  const { token } = useAuth.getState()
  if (!token) throw new Error('AUTH_REQUIRED')
  try {
    const r = await api.post(`/images/${imageId}/save-toggle`)
    // BE trả { saved: true/false }
    return !!r.data?.saved
  } catch (e) {
    // Không quăng lỗi 404 ra UI
    return false
  }
}
