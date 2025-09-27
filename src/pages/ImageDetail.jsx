import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAuth from '../store/auth'
import { getImageById, deleteImage } from '../services/images'
import { getCommentsByImage, addComment } from '../services/comments'
import { checkSaved, toggleSave } from '../services/saves'
import { BASE_URL } from '../services/api'

export default function ImageDetail(){
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [comments, setComments] = useState([])
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const [content, setContent] = useState('')
  
  const nav = useNavigate()

  const load = async () => {
    setLoading(true)
    const d = await getImageById(id)
    const full = d?.data || d
    setData(full)
    try { setSaved(await checkSaved(id)) } catch {}
    try {
      const c = await getCommentsByImage(id)
      setComments(c?.items || c || [])
    } catch {}
    setLoading(false)
  }

  useEffect(()=>{ load() }, [id])

  const onSave = async () => {
    try {
      const ok = await toggleSave(id)
      if (ok === false) {
        // Không thành công nhưng cũng không crash
      }
      setSaved(await checkSaved(id))
    } catch (e) {
      if (String(e?.message) === 'AUTH_REQUIRED') {
        nav('/?auth=login', { replace: true })
      }
    }
  }


  const onDelete = async () => {
    if(confirm('Xoá ảnh này?')){
      await deleteImage(id)
      window.history.back()
    }
  }

  const onAddComment = async (e) => {
    e.preventDefault()
    if(!content.trim()) return
    await addComment(id, content.trim())
    setContent('')
    const c = await getCommentsByImage(id)
    setComments(c?.items || c || [])
  }

  if(loading) return <div>Đang tải...</div>
  if(!data) return <div>Không tìm thấy ảnh.</div>

  const rawUrl = data?.url || data?.duong_dan || data?.imageUrl || data?.path || data?.image
  const imageUrl = rawUrl?.startsWith('http') ? rawUrl : `${BASE_URL}${rawUrl || ''}`
  const ownerId = data?.nguoi_dung_id || data?.userId || data?.ownerId
  const isOwner = user && (user?.nguoi_dung_id === ownerId || user?.id === ownerId || user?.userId === ownerId)

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-3xl p-4">
        <img src={imageUrl} alt={data?.ten_hinh || data?.title} className="w-full rounded-2xl object-contain" />
      </div>
      <div>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onSave} className={`rounded-full px-5 py-2 ${saved?'bg-black text-white':'bg-red-600 text-white'}`}>
            {saved ? 'Đã lưu' : 'Lưu'}
          </button>
          {isOwner && (
            <button onClick={onDelete} className="rounded-full px-5 py-2 border">Xoá</button>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-2">{data?.ten_hinh || data?.title}</h1>
        <p className="text-gray-600 mb-6">{data?.mo_ta || data?.description}</p>

        <h3 className="font-semibold mb-3">Nhận xét</h3>
        <div className="space-y-3 mb-4">
          {comments.map((c,i)=> (
            <div key={i} className="bg-gray-50 rounded-2xl px-4 py-3">
              <div className="text-sm font-medium">{c?.user?.fullName || c?.user?.name || c?.nguoi_dung?.ho_ten || 'User'}</div>
              <div>{c?.noi_dung || c?.content}</div>
            </div>
          ))}
          {!comments.length && <div className="text-gray-500">Chưa có nhận xét</div>}
        </div>

        <form onSubmit={onAddComment} className="flex gap-2">
          <input value={content} onChange={e=>setContent(e.target.value)} placeholder="Thêm nhận xét" className="flex-1 rounded-full border px-4 py-2"/>
          <button className="rounded-full bg-gray-900 text-white px-4 py-2">Gửi</button>
        </form>
      </div>
    </div>
  )
}
