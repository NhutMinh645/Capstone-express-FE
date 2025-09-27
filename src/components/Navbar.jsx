import React from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import useAuth from '../store/auth'

export default function Navbar(){
  const [sp] = useSearchParams()
  const navigate = useNavigate()
  const q = sp.get('q') || ''
  const { user, logout } = useAuth()

  const onSearch = (e) => {
    e.preventDefault()
    const v = e.target.q.value.trim()

    // Điều hướng kèm query để Home đọc q và gọi /images/search?name=...
    if (v) {
      navigate({ pathname: '/', search: `?q=${encodeURIComponent(v)}` })
    } else {
      // Xoá tìm kiếm -> quay về danh sách thường
      navigate('/')
    }
  }

  const handleLogout = () => {
    logout()
    // chuyển sang màn đăng nhập/đăng ký
    navigate('/auth?auth=login', { replace: true })
  }

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex items-center gap-3 px-4 py-3">
        <Link to="/" className="font-semibold text-xl">Trang chủ</Link>

        <form onSubmit={onSearch} className="flex-1">
          <input
            name="q"
            defaultValue={q}
            placeholder="Tìm kiếm"
            className="w-full rounded-full border px-4 py-2 outline-none"
          />
        </form>

        <Link to="/add" className="rounded-full bg-black text-white px-4 py-2">Tạo</Link>

        {user ? (
          <div className="flex items-center gap-2">
            <Link to="/profile" className="px-3 py-2 rounded-full bg-gray-100">
              {user?.ho_ten || user?.fullName || user?.name || 'Me'}
            </Link>
            <button onClick={handleLogout} className="px-3 py-2 rounded-full border">Đăng xuất</button>
          </div>
        ) : (
          <Link to="/auth?auth=login" className="px-3 py-2 rounded-full border">Đăng nhập</Link>
        )}
      </div>
    </header>
  )
}
