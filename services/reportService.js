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

export const getSpinPlayers = async ({ page = 1, limit = 10 } = {}) => {
  const { data } = await api.get(`/admin/spin/players?page=${page}&limit=${limit}`)
  return data
}

export const getSpinResults = async ({ page = 1, limit = 10 } = {}) => {
  const { data } = await api.get(`/admin/spin/results?page=${page}&limit=${limit}`)
  return data
}

export const getLevelsPlayers = async ({ page = 1, limit = 10, isActive, completedLevels } = {}) => {
  const params = new URLSearchParams({ page, limit })
  if (isActive !== undefined) params.set('isActive', isActive)
  if (completedLevels !== undefined) params.set('completedLevels', completedLevels)
  const { data } = await api.get(`/admin/levels/players?${params}`)
  return data
}

export const getLevelsPlayer = async (id) => {
  const { data } = await api.get(`/admin/levels/players/${id}`)
  return data
}
