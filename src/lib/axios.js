import axios from 'axios'

import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from '@/constants/local-storage'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((request) => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)

  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`
  }

  return request
})
