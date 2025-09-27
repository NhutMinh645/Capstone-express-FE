import api from './api'
export const getCommentsByImage = (imageId) => api.get(`/images/${imageId}/comments`).then(r=>r.data)
export const addComment = (imageId, content) => api.post(`/images/${imageId}/comments`, { content }).then(r=>r.data)
