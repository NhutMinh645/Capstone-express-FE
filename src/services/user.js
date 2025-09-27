import api from './api'
import useAuth from '../store/auth'

// Ưu tiên đúng route /users/*
export const getMe = async () => {
  try {
    const r = await api.get('/users/me')
    return r.data
  } catch (e) {
    // fallback cũ nếu cần
    try { return (await api.get('/me')).data } catch { throw e }
  }
}

export const updateMe = async (data) => {
  try {
    const r = await api.put('/users/me', data)
    return r.data
  } catch (e) {
    try { return (await api.put('/me', data)).data } catch { throw e }
  }
}

export const getMySaved = async () => {
  try {
    const r = await api.get('/users/me/saved')
    return r.data
  } catch (e) {
    try { return (await api.get('/me/saved')).data } catch { return { items: [] } }
  }
}

export const getMyCreated = async () => {
  try {
    const r = await api.get('/users/me/created')
    return r.data
  } catch (e) {
    try { return (await api.get('/me/created')).data } catch { return { items: [] } }
  }
}
