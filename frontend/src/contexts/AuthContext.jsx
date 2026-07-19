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
      const data = await authService.getProfile()
      setUser(data.user)
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
      setToken(res.token)
      localStorage.setItem('agrisense_token', res.token)
      setUser(res.user)
      toast.success('Successfully logged in')
      return res
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      throw error
    }
  }

  const register = async (data) => {
    try {
      const res = await authService.register(data)
      setToken(res.token)
      localStorage.setItem('agrisense_token', res.token)
      setUser(res.user)
      toast.success('Registration successful')
      return res
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
      throw error
    }
  }

  const loginWithGoogle = async (googleToken) => {
    try {
      const res = await authService.googleLogin(googleToken)
      setToken(res.token)
      localStorage.setItem('agrisense_token', res.token)
      setUser(res.user)
      toast.success('Successfully logged in with Google')
      return res
    } catch (error) {
      toast.error('Google login failed')
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
    isGuest: user?.role === 'guest',
    login,
    register,
    loginWithGoogle,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
