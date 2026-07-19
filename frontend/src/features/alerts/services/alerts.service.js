import api from '../../../services/api'

export const fetchAlerts = async () => {
  const response = await api.get('/alerts')
  return response.data
}

export const createAlert = async (data) => {
  const response = await api.post('/alerts/price', data)
  return response.data
}

export const toggleAlert = async ({ id, isActive }) => {
  const response = await api.patch(`/alerts/${id}/toggle`, { isActive })
  return response.data
}

export const deleteAlert = async (id) => {
  const response = await api.del(`/alerts/${id}`) // Using api.del from our api service
  return response.data
}
