import axios from 'axios'

/**
 * Configured Axios instance shared across all repositories.
 *
 * Automatically injects the JWT Bearer token from localStorage on every
 * request, so repositories don't need to pass the token manually.
 *
 * Base URL is taken from the Vite env variables VITE_API_BASE_URL + VITE_API_PATH.
 *
 * @type {import('axios').AxiosInstance}
 */
const http = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_PATH}`,
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  config.headers = config.headers || {}

  if (token && token !== 'undefined') {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginPage = window.location.pathname === '/sign-in'
      if (!isLoginPage) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        window.location.href = '/sign-in'
      }
    }
    return Promise.reject(error)
  }
)

export default http
