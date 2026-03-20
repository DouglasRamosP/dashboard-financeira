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
          <Input type="password" placeholder="Senha"></Input>
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
