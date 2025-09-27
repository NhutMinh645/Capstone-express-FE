import React, { useEffect, useState, useMemo } from 'react'
import useAuth from '../store/auth'
import { getMe, getMySaved, getMyCreated } from '../services/user'
import { deleteImage } from '../services/images'
import { toggleSave } from '../services/saves'
import ImageCard from '../components/ImageCard'

// Lấy id ảnh từ nhiều biến thể dữ liệu (saved có thể là { image: {...} })
function getItemId(item = {}) {
  const core =
    (typeof item.image === 'object' && item.image) ||
    (typeof item.Image === 'object' && item.Image) ||
    item
  return (
    core?.id ??
    core?.imageId ??
    item?.imageId ??
    item?.hinh_id ??
    item?.id ??
    null
  )
}

// Khử trùng lặp theo id
function dedupeById(list = []) {
  const seen = new Set()
  return list.filter(it => {
    const id = getItemId(it)
    if (id == null) return true // nếu không có id, vẫn cho hiển thị 1 bản
    if (seen.has(id)) return false
    seen.add(id)
    return true
  })
}

export default function Profile(){
  const { user, setAuth } = useAuth()
  const [me, setMe] = useState(user)
  const [tab, setTab] = useState('saved')
  const [saved, setSaved] = useState([])
  const [created, setCreated] = useState([])

  // Danh sách đã khử trùng lặp (an toàn khi BE trả trùng)
  const savedUniq = useMemo(() => dedupeById(saved), [saved])
  const createdUniq = useMemo(() => dedupeById(created), [created])

  const load = async () => {
    try{
      const d = await getMe()
      const meData = d?.data || d
      setMe(meData)
      setAuth(localStorage.getItem('token'), meData)
    }catch{}

    try{
      const s = await getMySaved()
      const items = Array.isArray(s?.items) ? s.items : Array.isArray(s) ? s : []
      setSaved(dedupeById(items))
    }catch{
      setSaved([]) // tránh giữ state cũ gây cảm giác “nhân 2”
    }

    try{
      const c = await getMyCreated()
      const items = Array.isArray(c?.items) ? c.items : Array.isArray(c) ? c : []
      setCreated(dedupeById(items))
    }catch{
      setCreated([])
    }
  }

  useEffect(()=>{ load() },[])

  const remove = async (id) => {
    if(confirm('Xoá ảnh đã tạo?')){
      await deleteImage(id)
      await load()
    }
  }

  const unsave = async (id) => {
    if (!id) return
    // Tối ưu: xoá ngay trên UI để phản hồi nhanh
    setSaved(prev => prev.filter(it => getItemId(it) !== id))
    try {
      await toggleSave(id) // BE: POST /images/:id/save-toggle
    } catch {
      // nếu BE lỗi, load lại để đồng bộ
      await load()
    }
  }

  return (
    <div>
      <div className="text-center mb-6">
        <div className="mx-auto w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold">
          {(me?.fullName || me?.ho_ten || 'U')[0]}
        </div>
        <h2 className="text-2xl font-semibold mt-3">{me?.fullName || me?.ho_ten}</h2>
        <div className="flex gap-2 justify-center mt-4">
          <a href="/me/edit" className="px-4 py-2 rounded-full border">Chỉnh sửa hồ sơ</a>
        </div>
        <div className="mt-6 flex gap-4 justify-center">
          <button
            className={`px-4 py-2 rounded-full ${tab==='created'?'bg-black text-white':'border'}`}
            onClick={()=>setTab('created')}
          >
            Đã tạo
          </button>
          <button
            className={`px-4 py-2 rounded-full ${tab==='saved'?'bg-black text-white':'border'}`}
            onClick={()=>setTab('saved')}
          >
            Đã lưu
          </button>
        </div>
      </div>

      {tab==='saved' ? (
        <div className="masonry">
          {savedUniq.map(it => {
            const id = getItemId(it)
            const key = id != null ? `saved-${id}` : `saved-${Math.random()}`
            return (
              <div key={key} className="relative">
                <ImageCard item={it} />
                {/* Nút BỎ LƯU hiển thị trực tiếp trên ảnh */}
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); unsave(id) }}
                  className="absolute top-3 right-3 rounded-full bg-white/90 border px-3 py-1 text-sm hover:bg-white"
                  title="Bỏ lưu"
                >
                  Bỏ lưu
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="masonry">
          {createdUniq.map(it => {
            const id = getItemId(it)
            const key = id != null ? `created-${id}` : `created-${Math.random()}`
            return (
              <div key={key} className="relative">
                <ImageCard item={it} />
                {id != null && (
                  <button
                    onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); remove(id) }}
                    className="absolute top-3 right-3 rounded-full bg-white/90 border px-3 py-1 text-sm hover:bg-white"
                  >
                    Xoá
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
