import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
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
import { api } from '@/lib/axios'

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve conter no mínimo 6 caracteres' }),
})

const LoginPage = () => {
  const navigate = useNavigate()

  const LoginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async (variables) => {
      const response = await api.post('api/users/login', {
        email: variables.email,
        password: variables.password,
      })
      return response.data
    },
  })

  const handleSubmit = (data) => {
    LoginMutation.mutate(data, {
      onSuccess: (loginUser) => {
        const accessToken =
          loginUser?.tokens?.accessToken ??
          loginUser?.token?.accessToken ??
          loginUser?.accessToken
        const refreshToken =
          loginUser?.tokens?.refreshToken ??
          loginUser?.token?.refreshToken ??
          loginUser?.refreshToken

        if (!accessToken || !refreshToken) {
          toast.error('Login inválido: a API não retornou os tokens esperados.')
          return
        }

        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)

        toast.success('Login realizado com sucesso!')
        console.log(loginUser)
        navigate('/')
      },
      onError: (error) => {
        const message =
          error?.response?.data?.message || 'Ocorreu um erro ao fazer login'
        toast.error(message)
      },
    })
  }

  const methods = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    const init = async () => {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')

      if (!accessToken || !refreshToken) return

      try {
        await api.get('api/users/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        navigate('/')
      } catch (error) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        console.error('Error fetching user data:', error)
      }
    }

    init()
  }, [navigate])

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
              <Button onSubmit={methods.handleSubmit} className="w-full">
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
