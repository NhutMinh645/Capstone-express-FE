import React from 'react'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../services/api'

// Lấy ra { id, title, rawUrl } từ nhiều biến thể dữ liệu (image object lồng, field khác tên, v.v.)
function normalizeItem(item = {}) {
  // Một số API trả { image: {...} } cho danh sách đã lưu
  const imageObj =
    (typeof item.image === 'object' && item.image) ||
    (typeof item.Image === 'object' && item.Image) ||
    (typeof item.hinh === 'object' && item.hinh) ||
    (typeof item.photo === 'object' && item.photo) ||
    null

  const core = imageObj || item

  const id =
    core.id ??
    core.imageId ??
    item.imageId ??
    item.hinh_id ??
    item.id

  const title =
    core.name ??
    core.ten_hinh ??
    core.title ??
    core.tenHinh ??
    core.imageName ??
    ''

  // Thử nhiều key url
  let raw =
    core.url ??
    core.duong_dan ??
    core.imageUrl ??
    core.duongDan ??
    core.path ??
    core.image ??
    null

  // Nếu raw là object (thỉnh thoảng BE nhét tiếp object), thử đào sâu thêm 1 lớp
  if (raw && typeof raw === 'object') {
    raw =
      raw.url ??
      raw.duong_dan ??
      raw.imageUrl ??
      raw.path ??
      null
  }

  return { id, title, rawUrl: raw }
}

// Chuyển về absolute URL chỉ khi là string
function toAbsoluteUrl(raw) {
  if (typeof raw !== 'string') return ''
  return raw.startsWith('http') ? raw : `${BASE_URL}${raw}`
}

export default function ImageCard({ item }) {
  const { id, title, rawUrl } = normalizeItem(item)
  const url = toAbsoluteUrl(rawUrl)

  // Placeholder khi chưa có url hợp lệ để tránh vỡ layout
  const placeholder =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="16">No image</text>
      </svg>`
    )

  const href = typeof id === 'number' || typeof id === 'string' ? `/images/${id}` : '#'

  return (
    <div className="masonry-item rounded-3xl overflow-hidden bg-white shadow">
      <Link to={href}>
        <img
          src={url || placeholder}
          alt={title}
          className="w-full object-cover"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = placeholder }}
        />
      </Link>
      <div className="p-3">
        <div className="font-medium line-clamp-1">{title || 'Untitled'}</div>
      </div>
    </div>
  )
}
