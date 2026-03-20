import { EyeIcon, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-3">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Crie a sua conta</CardTitle>
          <CardDescription>
            Faça o cadastro para acessar o dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="Nome"></Input>
          <Input placeholder="Sobrenome"></Input>
          <Input placeholder="Email"></Input>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
            ></Input>
            <Button
              variant="ghost"
              className="absolute bottom-0 right-0 top-0 my-auto mr-1 h-8 w-8 text-muted-foreground"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff /> : <EyeIcon />}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Registrar</Button>
        </CardFooter>
      </Card>
      <div className="flex items-center justify-center">
        <p className="text-center opacity-50">Já tem uma conta?</p>
        <Button variant="link" className="px-2" asChild>
          <Link to="/login">Faça login </Link>
        </Button>
      </div>
    </div>
  )
}

export default SignupPage
