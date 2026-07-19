export const APP_NAME = import.meta.env.VITE_APP_NAME || 'AgriSense AI'
export const APP_VERSION = '0.1.0'
export const APP_TAGLINE = 'Smart Farming Decisions'
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PRICES: '/prices',
  COPILOT: '/copilot',
  PREDICTIONS: '/predictions',
  WEATHER: '/weather',
  NEWS: '/news',
  ALERTS: '/alerts',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ADMIN: '/admin',
}

export const CROP_CATEGORIES = [
  'Cereals',
  'Vegetables',
  'Fruits',
  'Pulses',
  'Oilseeds',
  'Spices'
]

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli',
  'Daman and Diu', 'Lakshadweep', 'Delhi', 'Puducherry'
]

export const QUERY_KEYS = {
  USER: 'user',
  MARKET_PRICES: 'marketPrices',
  PREDICTIONS: 'predictions',
  WEATHER: 'weather',
  NEWS: 'news',
  ALERTS: 'alerts',
}

export const PRICE_TRENDS = {
  UP: 'up',
  DOWN: 'down',
  STABLE: 'stable',
}

export const ALERT_TYPES = {
  PRICE: 'price',
  WEATHER: 'weather',
  NEWS: 'news',
  AI: 'ai',
}

export const USER_ROLES = {
  ADMIN: 'admin',
  FARMER: 'farmer',
  GUEST: 'guest',
}

export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 4000,
  LONG: 6000,
}

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE: 1,
}
