import { Navigate } from 'react-router'

import { Button } from '@/components/ui/button'

import { useAuthContext } from '../contexts/auth'

const HomePage = () => {
  const { user, loading, logout } = useAuthContext()

  if (loading) {
    return <p>Carregando...</p>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div>
      <h1>Olá, {user.first_name} </h1>
      <Button onClick={logout}>Sair</Button>
    </div>
  )
}

export default HomePage
