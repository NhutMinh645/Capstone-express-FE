import api from './api'

// List: nếu có q => /images/search?name=..., ngược lại /images
export const getImages = async (q = '') => {
  if (q && q.trim()) {
    const res = await api.get('/images/search', { params: { name: q } })
    return res.data
  }
  const res = await api.get('/images')
  return res.data
}

export const getImageById = (id) => api.get(`/images/${id}`).then(r => r.data)

/**
 * Tạo ảnh:
 * - BE yêu cầu:
 *   - field file: "image"
 *   - "name": string
 *   - "description": string
 */
export const createImage = async (payload = {}) => {
  const { file } = payload

  // Ưu tiên các alias -> ép về string
  const _name = (payload.name ?? payload.title ?? payload.ten_hinh ?? '').toString()
  const _desc = (payload.description ?? payload.mo_ta ?? '').toString()

  const form = new FormData()
  if (file) form.append('image', file, file.name)
  form.append('name', _name)
  form.append('description', _desc)

  const res = await api.post('/images', form)
  return res.data
}

export const deleteImage = (id) => api.delete(`/images/${id}`).then(r => r.data)
