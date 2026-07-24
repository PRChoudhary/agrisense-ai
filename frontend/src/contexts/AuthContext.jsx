import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/auth.service'
import api from '../services/api'
import { toast } from 'react-hot-toast'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('agrisense_token'))
  const [isLoading, setIsLoading] = useState(true)

  const loadUser = useCallback(async () => {
    if (!token) {
      setIsLoading(false)
      return
    }
    
    try {
      const res = await authService.getProfile()
      const userData = res.data || res.user || res
      if (userData && userData.id) {
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Failed to load user profile:', error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
    loadUser()
  }, [token, loadUser])

  const login = async (credentials) => {
    try {
      const res = await authService.login(credentials.email, credentials.password)
      const payload = res.data || res
      const authToken = payload.accessToken || payload.token
      const userData = payload.user || payload

      if (!authToken) throw new Error('Invalid token returned from server')

      setToken(authToken)
      localStorage.setItem('agrisense_token', authToken)
      setUser(userData)
      toast.success('Successfully logged in')
      return res
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Login failed'
      toast.error(msg)
      throw error
    }
  }

  const register = async (data) => {
    try {
      const res = await authService.register(data)
      const payload = res.data || res
      const authToken = payload.accessToken || payload.token
      const userData = payload.user || payload

      if (!authToken) throw new Error('Invalid token returned from server')

      setToken(authToken)
      localStorage.setItem('agrisense_token', authToken)
      setUser(userData)
      toast.success('Registration successful')
      return res
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Registration failed'
      toast.error(msg)
      throw error
    }
  }

  const loginWithGoogle = async (googleToken) => {
    try {
      const res = await authService.googleLogin(googleToken)
      const payload = res.data || res
      const authToken = payload.accessToken || payload.token
      const userData = payload.user || payload

      setToken(authToken)
      localStorage.setItem('agrisense_token', authToken)
      setUser(userData)
      toast.success('Successfully logged in with Google')
      return res
    } catch (error) {
      toast.error('Google login failed')
      throw error
    }
  }

  const updateProfile = async (updateData) => {
    try {
      const res = await authService.updateProfile(updateData)
      const updatedUser = res.data || res.user || res
      setUser(prev => ({ ...prev, ...updatedUser }))
      toast.success('Profile updated successfully')
      return updatedUser
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to update profile'
      toast.error(msg)
      throw error
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('agrisense_token')
    delete api.defaults.headers.common['Authorization']
    toast.success('Logged out successfully')
  }

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    isGuest: user?.role === 'GUEST' || user?.role === 'guest',
    login,
    register,
    loginWithGoogle,
    updateProfile,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
