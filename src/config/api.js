import axios from 'axios'

// ---------------------------------------------------------------------------
// Base URL & Key Configuration from .env
// ---------------------------------------------------------------------------
const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const API_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_API_KEY ||
  ''

const IS_SUPABASE = BASE_URL.includes('supabase.co') || Boolean(API_KEY)

// ---------------------------------------------------------------------------
// Axios Client Instance
// ---------------------------------------------------------------------------
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
})

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    if (IS_SUPABASE && API_KEY) {
      config.headers['apikey'] = API_KEY
      if (!config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${API_KEY}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'Terjadi kesalahan sistem yang tidak terduga'
    let status = null
    if (error.response) {
      status = error.response.status
      message =
        error.response.data?.message ||
        error.response.data?.msg ||
        error.response.data?.error ||
        `Kesalahan server (${status})`
    } else if (error.request) {
      message = 'Gagal menghubungi server backend. Aplikasi tetap berjalan normal dalam mode offline lokal.'
    } else {
      message = error.message || message
    }
    return Promise.reject({
      message,
      status,
      code: error.response?.data?.code,
      raw: error.response?.data,
    })
  }
)

export { apiClient, BASE_URL, API_KEY, IS_SUPABASE }
