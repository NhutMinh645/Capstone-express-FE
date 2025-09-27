import { create } from 'zustand'

const useAuth = create((set, get) => ({
  token: localStorage.getItem('token') || '',
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  setAuth: (token, user) => {
    if(token){ localStorage.setItem('token', token) } else { localStorage.removeItem('token') }
    if(user){ localStorage.setItem('user', JSON.stringify(user)) } else { localStorage.removeItem('user') }
    set({ token: token || '', user: user || null })
  },
  logout: () => {
    localStorage.removeItem('token'); localStorage.removeItem('user')
    set({ token: '', user: null })
  }
}))

export default useAuth
