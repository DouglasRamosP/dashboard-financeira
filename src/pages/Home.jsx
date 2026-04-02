import { Navigate } from 'react-router'

import { useAuthContext } from '../contexts/auth'

const HomePage = () => {
  const { user, loading } = useAuthContext()

  if (loading) {
    return <p>Carregando...</p>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}

export default HomePage
