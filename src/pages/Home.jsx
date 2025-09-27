import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getImages } from '../services/images'
import ImageCard from '../components/ImageCard'

export default function Home(){
  const [sp] = useSearchParams()
  const q = sp.get('q') || ''
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getImages(q).then((data)=>{
      const arr = data?.items || data || []
      setItems(arr)
    }).finally(()=>setLoading(false))
  }, [q])

  return (
    <div>
      {loading && <div className="text-center py-10">Đang tải...</div>}
      <div className="masonry">
        {items.map(it => <ImageCard key={(it.id ?? it.hinh_id ?? Math.random())} item={it} />)}
      </div>
    </div>
  )
}
