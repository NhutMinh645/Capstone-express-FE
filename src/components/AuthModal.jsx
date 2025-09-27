import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { login, register as apiRegister } from '../services/auth'
import useAuth from '../store/auth'

export default function AuthModal({ mode='login' }){
  const [tab, setTab] = useState(mode)
  const { setAuth } = useAuth()
  const nav = useNavigate()
  const { register, handleSubmit } = useForm()

  const onLogin = async (data) => {
    const res = await login(data)
    const token = res?.token || res?.accessToken || res?.data?.token
    const user = res?.user || res?.data?.user
    setAuth(token, user)
    nav('/', { replace: true })
  }

  const onRegister = async (data) => {
    await apiRegister(data)
    await onLogin({ email: data.email, password: data.password })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-8 relative">
        <button onClick={()=>nav('/',{replace:true})} className="absolute right-4 top-4 text-2xl">×</button>
        <h2 className="text-3xl font-bold mb-2">Welcome to my picture</h2>
        <p className="text-gray-500 mb-6">{tab==='login' ? 'Đăng nhập' : 'Tạo tài khoản'}</p>

        <div className="flex gap-2 mb-6">
          <button className={`px-4 py-2 rounded-full ${tab==='login'?'bg-red-600 text-white':'border'}`} onClick={()=>setTab('login')}>Đăng nhập</button>
          <button className={`px-4 py-2 rounded-full ${tab==='register'?'bg-red-600 text-white':'border'}`} onClick={()=>setTab('register')}>Đăng ký</button>
        </div>

        {tab==='login' ? (
          <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
            <input {...register('email')} placeholder="Email" className="w-full rounded-xl border px-4 py-3" required/>
            <input {...register('password')} type="password" placeholder="Mật khẩu" className="w-full rounded-xl border px-4 py-3" required/>
            <button className="w-full rounded-full bg-red-600 text-white py-3">Đăng nhập</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
            <input {...register('email')} placeholder="Email" className="w-full rounded-xl border px-4 py-3" required/>
            <input {...register('password')} type="password" placeholder="Tạo mật khẩu" className="w-full rounded-xl border px-4 py-3" required/>
            <input {...register('fullName')} placeholder="Họ tên" className="w-full rounded-xl border px-4 py-3"/>
            <input {...register('age')} type="number" placeholder="Tuổi" className="w-full rounded-xl border px-4 py-3"/>
            <button className="w-full rounded-full bg-red-600 text-white py-3">Đăng ký</button>
          </form>
        )}
      </div>
    </div>
  )
}
