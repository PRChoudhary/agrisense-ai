import { get, post } from './api'

export const authService = {
  /**
   * Login user
   * @param {string} email 
   * @param {string} password 
   */
  login: (email, password) => post('/auth/login', { email, password }),
  
  /**
   * Register user
   * @param {Object} data 
   */
  register: (data) => post('/auth/register', data),
  
  /**
   * Login with Google
   * @param {string} token 
   */
  googleLogin: (token) => post('/auth/google', { token }),
  
  /**
   * Refresh auth token
   */
  refreshToken: () => post('/auth/refresh'),
  
  /**
   * Logout
   */
  logout: () => post('/auth/logout'),
  
  /**
   * Get current user profile
   */
  getProfile: () => get('/auth/me')
}
