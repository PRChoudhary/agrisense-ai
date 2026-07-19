import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agrisense_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('agrisense_token')
      window.dispatchEvent(new Event('auth:unauthorized'))
      // Consider using a router redirect here if necessary
    }
    
    const customError = new Error(
      error.response?.data?.message || error.message || 'An unexpected error occurred'
    )
    customError.status = error.response?.status
    customError.data = error.response?.data
    
    return Promise.reject(customError)
  }
)

export const get = (url, config) => api.get(url, config)
export const post = (url, data, config) => api.post(url, data, config)
export const put = (url, data, config) => api.put(url, data, config)
export const patch = (url, data, config) => api.patch(url, data, config)
export const del = (url, config) => api.delete(url, config)

export default api
