import React from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import AuthModal from './components/AuthModal.jsx'
import Home from './pages/Home.jsx'
import ImageDetail from './pages/ImageDetail.jsx'
import Profile from './pages/Profile.jsx'
import AddImage from './pages/AddImage.jsx'
import EditProfile from './pages/EditProfile.jsx'
import useAuth from './store/auth.js'

function RequireAuth({ children }){
  const { token } = useAuth()
  if(!token) return <Navigate to="/auth?auth=login" replace />
  return children
}

export default function App(){
  const { token } = useAuth()
  const location = useLocation()
  const showAuth = new URLSearchParams(location.search).get('auth')

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          {/* Nếu chưa đăng nhập => root "/" sẽ chuyển sang /auth?auth=login */}
          <Route
            path="/"
            element={token ? <Home /> : <Navigate to="/auth?auth=login" replace />}
          />

          <Route path="/images/:id" element={<ImageDetail />} />

          <Route
            path="/profile"
            element={<RequireAuth><Profile /></RequireAuth>}
          />
          <Route
            path="/add"
            element={<RequireAuth><AddImage /></RequireAuth>}
          />
          <Route
            path="/me/edit"
            element={<RequireAuth><EditProfile /></RequireAuth>}
          />

          {/* Trang rỗng để hiển thị modal auth */}
          <Route path="/auth" element={<div />} />
        </Routes>
      </div>

      {/* Modal đăng nhập/đăng ký */}
      {showAuth && <AuthModal mode={showAuth} />}
    </div>
  )
}
