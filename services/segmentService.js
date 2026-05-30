import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const getSegments = async () => {
  const { data } = await api.get('/admin/segments')
  return data
}

export const createSegment = async (payload) => {
  const { data } = await api.post('/admin/segments', payload)
  return data
}

export const updateSegment = async (id, payload) => {
  const { data } = await api.patch(`/admin/segments/${id}`, payload)
  return data
}

export const deleteSegment = async (id) => {
  const { data } = await api.delete(`/admin/segments/${id}`)
  return data
}

export const toggleSegmentWinnable = async (id) => {
  const { data } = await api.patch(`/admin/segments/${id}/toggle-winnable`)
  return data
}

export const updateSegmentQuantity = async (id, quantity) => {
  const { data } = await api.patch(`/admin/segments/${id}/update-quantity`, { quantity })
  return data
}
