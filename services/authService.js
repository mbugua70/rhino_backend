import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

// Intercept 401 globally to clear session
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const loginAdmin = async (payload) => {
  const { data } = await api.post('/auth/login', payload)
  return data
}

export const logoutAdmin = async () => {
  const { data } = await api.post('/auth/logout')
  return data
}

export const getSession = async () => {
  const { data } = await api.get('/auth/session')
  return data
}
