import { LogOutIcon } from 'lucide-react'

import logo from '@/assets/images/logo.svg'
import { useAuthContext } from '@/contexts/auth'

import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

const Header = () => {
  const { user, logout } = useAuthContext()

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <img src={logo} alt="FinTrack" className="h-8 w-auto" />
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              {user?.firstName} {user?.lastName}
            </p>
            <p>{user?.email}</p>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOutIcon />
            Sair
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Header
