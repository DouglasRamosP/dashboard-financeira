import { zodResolver } from '@hookform/resolvers/zod'
import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'

import PasswordInput from '@/components/password-input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AuthContext } from '@/contexts/auth'

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve conter no mínimo 6 caracteres' }),
})

const LoginPage = () => {
  const { login, user } = useContext(AuthContext)
  const navigate = useNavigate()

  const methods = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [navigate, user])

  const handleSubmit = async (data) => {
    try {
      await login(data)
      toast.success('Login realizado com sucesso!')
      navigate('/')
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Ocorreu um erro ao fazer login'
      toast.error(message)
    }
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-3">
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Card className="w-[500px]">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Faça login para acessar o dashboard financeiro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={methods.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Informe seu e-mail" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PasswordInput
                        placeholder="Informe sua senha"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Ainda não possui uma conta?{' '}
        <Link to="/Signup" className="font-medium text-primary hover:underline">
          Cadatre-se
        </Link>
      </p>
    </div>
  )
}

export default LoginPage
