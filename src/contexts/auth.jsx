import { createContext, useContext, useEffect, useState } from 'react'

import { api } from '@/lib/axios'

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
})

export const useAuthContext = () => useContext(AuthContext)

const getTokensFromResponse = (payload) => {
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

export const AuthContexProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')

      if (!accessToken || !refreshToken) {
        setLoading(false)
        return
      }

      try {
        const response = await api.get('api/users/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        setUser(response.data)
      } catch {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
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

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    const meResponse = await api.get('api/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    setUser(meResponse.data)

    return payload
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
