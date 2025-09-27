import React, { useState } from 'react'
import { createImage } from '../services/images'

export default function AddImage(){
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    const name = (title || '').trim()
    const description = (desc || '').trim()

    if (!file) return alert('Vui lòng chọn ảnh')
    if (!name) return alert('Vui lòng nhập tên ảnh')
    if (!description) return alert('Vui lòng nhập mô tả')

    try {
      setSubmitting(true)
      await createImage({ file, name, description }) // gửi đúng field BE
      alert('Tải lên thành công')
      window.location.href = '/'
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Lỗi tải lên'
      alert(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl p-6">
      <h2 className="text-2xl font-semibold mb-4">Thêm ảnh</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={e=>setFile(e.target.files[0])}
          className="w-full"
        />
        <input
          value={title}
          onChange={e=>setTitle(e.target.value)}
          placeholder="Tên hình"
          className="w-full rounded-xl border px-4 py-3"
        />
        <textarea
          value={desc}
          onChange={e=>setDesc(e.target.value)}
          placeholder="Mô tả"
          className="w-full rounded-xl border px-4 py-3"
        />
        <button
          disabled={submitting}
          className="rounded-full bg-black text-white px-6 py-3 disabled:opacity-60"
        >
          {submitting ? 'Đang đăng...' : 'Đăng'}
        </button>
      </form>
    </div>
  )
}
