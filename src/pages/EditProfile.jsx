import React, { useEffect, useState } from 'react'
import { getMe, updateMe } from '../services/user'
import useAuth from '../store/auth'

export default function EditProfile(){
  const [form, setForm] = useState({ fullName: '', age: '' })
  const { setAuth } = useAuth()

  useEffect(()=>{
    getMe().then((d)=>{
      const me = d?.data || d
      setForm({ fullName: me?.fullName || me?.ho_ten || '', age: me?.age || me?.tuoi || '' })
    }).catch(()=>{})
  },[])

  const onSubmit = async (e) => {
    e.preventDefault()
    await updateMe({ fullName: form.fullName, age: form.age, ho_ten: form.fullName, tuoi: form.age })
    const me = await getMe().catch(()=>null)
    if (me) setAuth(localStorage.getItem('token'), me?.data || me)
    alert('Đã cập nhật')
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl p-6">
      <h2 className="text-2xl font-semibold mb-4">Chỉnh sửa thông tin cá nhân</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})} placeholder="Họ tên" className="w-full rounded-xl border px-4 py-3" required/>
        <input value={form.age} onChange={e=>setForm({...form, age:e.target.value})} placeholder="Tuổi" type="number" className="w-full rounded-xl border px-4 py-3"/>
        <button className="rounded-full bg-black text-white px-6 py-3">Lưu</button>
      </form>
    </div>
  )
}
