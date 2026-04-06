import axios from 'axios'

import {
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
} from '@/constants/local-storage'

const API_URL = import.meta.env.VITE_API_URL
const REFRESH_TOKEN_URL = 'api/users/refresh-token'

export const getTokensFromResponse = (payload) => {
  const accessToken =
    payload?.tokens?.accessToken ??
    payload?.token?.accessToken ??
    payload?.accessToken
  const refreshToken =
    payload?.tokens?.refreshToken ??
    payload?.token?.refreshToken ??
    payload?.refreshToken

  return {
    accessToken,
    refreshToken,
  }
}

export const getStoredTokens = () => ({
  accessToken: localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY),
  refreshToken: localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY),
})

export const storeTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) {
    localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, accessToken)
  }

  if (refreshToken) {
    localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, refreshToken)
  }
}

export const clearTokens = () => {
  localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)
  localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY)
}

export const api = axios.create({
  baseURL: API_URL,
})

const refreshApi = axios.create({
  baseURL: API_URL,
})

let refreshPromise = null

const refreshSession = async () => {
  const { refreshToken } = getStoredTokens()

  if (!refreshToken) {
    throw new Error('Refresh token nao encontrado.')
  }

  refreshPromise ??= refreshApi
    .post(REFRESH_TOKEN_URL, { refreshToken })
    .then((response) => {
      const tokens = getTokensFromResponse(response.data)

      if (!tokens.accessToken || !tokens.refreshToken) {
        throw new Error('A API nao retornou os tokens esperados no refresh.')
      }

      storeTokens(tokens)

      return tokens
    })
    .catch((error) => {
      clearTokens()
      throw error
    })
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}

api.interceptors.request.use((request) => {
  const { accessToken } = getStoredTokens()

  if (!request.headers) {
    request.headers = {}
  }

  if (accessToken && !request.url?.includes(REFRESH_TOKEN_URL)) {
    request.headers.Authorization = `Bearer ${accessToken}`
  }

  return request
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    if (!originalRequest || status !== 401) {
      return Promise.reject(error)
    }

    if (
      originalRequest._retry ||
      originalRequest.url?.includes(REFRESH_TOKEN_URL)
    ) {
      clearTokens()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const { accessToken } = await refreshSession()

      if (!originalRequest.headers) {
        originalRequest.headers = {}
      }

      originalRequest.headers.Authorization = `Bearer ${accessToken}`

      return api(originalRequest)
    } catch (refreshError) {
      return Promise.reject(refreshError)
    }
  }
)
