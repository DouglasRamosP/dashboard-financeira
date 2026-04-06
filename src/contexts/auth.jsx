import { createContext, useContext, useEffect, useRef, useState } from 'react'

import {
  api,
  clearTokens,
  getStoredTokens,
  getTokensFromResponse,
  storeTokens,
} from '@/lib/axios'

export const AuthContext = createContext({
  user: null,
  loading: true,
  isInitializing: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  signOut: () => {},
})

export const useAuthContext = () => useContext(AuthContext)

const normalizeUser = (payload) => {
  const firstName = payload?.firstName ?? payload?.first_name ?? ''
  const lastName = payload?.lastName ?? payload?.last_name ?? ''

  return {
    id: payload?.id ?? '',
    email: payload?.email ?? '',
    firstName,
    lastName,
    first_name: firstName,
    last_name: lastName,
  }
}

export const AuthContexProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (hasInitialized.current) {
      return
    }

    hasInitialized.current = true

    const init = async () => {
      const { accessToken, refreshToken } = getStoredTokens()

      if (!accessToken || !refreshToken) {
        setLoading(false)
        return
      }

      try {
        const response = await api.get('api/users/me')

        setUser(normalizeUser(response.data))
      } catch (error) {
        if (error?.response?.status === 401) {
          clearTokens()
        }

        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const signup = async (data) => {
    const response = await api.post('api/users', {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
    })

    return response.data
  }

  const login = async (data) => {
    const response = await api.post('api/users/login', {
      email: data.email,
      password: data.password,
    })

    const payload = response.data
    const { accessToken, refreshToken } = getTokensFromResponse(payload)

    if (!accessToken || !refreshToken) {
      throw new Error('A API nao retornou os tokens esperados.')
    }

    storeTokens({ accessToken, refreshToken })

    const meResponse = await api.get('api/users/me')

    setUser(normalizeUser(meResponse.data))

    return payload
  }

  const logout = () => {
    clearTokens()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isInitializing: loading,
        login,
        signup,
        logout,
        signOut: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const AuthContextProvider = AuthContexProvider
