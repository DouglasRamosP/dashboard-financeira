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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/axios'

export const SignupSchema = z
  .object({
    firstName: z.string().trim().min(1, { message: 'O nome é obrigatório' }),
    lastName: z
      .string()
      .trim()
      .min(1, { message: 'O sobrenome é obrigatório' }),
    email: z.string().email({ message: 'Email inválido' }),
    password: z
      .string()
      .min(6, { message: 'A senha deve conter no mínimo 6 caracteres' }),
    confirmPassword: z.string().min(6, {
      message: 'A confirmação de senha deve conter no mínimo 6 caracteres',
    }),
    termsAccepted: z.boolean().refine((value) => value === true, {
      message: 'Você deve aceitar os termos de uso e a política de privacidade',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
  })

const SignupPage = () => {
  const navigate = useNavigate()

  const SignupMutation = useMutation({
    mutationKey: ['signup'],
    mutationFn: async (variables) => {
      const response = await api.post('api/users', {
        first_name: variables.firstName,
        last_name: variables.lastName,
        email: variables.email,
        password: variables.password,
      })
      return response.data
    },
  })

  const methods = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
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

  const handleSubmit = (data) => {
    SignupMutation.mutate(data, {
      onSuccess: (createdUser) => {
        const accessToken =
          createdUser?.tokens?.accessToken ??
          createdUser?.token?.accessToken ??
          createdUser?.accessToken
        const refreshToken =
          createdUser?.tokens?.refreshToken ??
          createdUser?.token?.refreshToken ??
          createdUser?.refreshToken

        if (accessToken) {
          localStorage.setItem('accessToken', accessToken)
        }

        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken)
        }

        toast.success('Conta criada com sucesso! Faça login para continuar.')
        methods.reset()
        navigate('/login')
      },
      onError: (error) => {
        const message =
          error.response?.data?.message ||
          'Ocorreu um erro ao criar a conta. Tente novamente.'
        toast.error(message)
      },
    })
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-3">
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Card className="w-[500px]">
            <CardHeader>
              <CardTitle>Crie a sua conta</CardTitle>
              <CardDescription>
                Faça o cadastro para acessar o dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={methods.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Digite seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={methods.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Digite seu sobrenome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={methods.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Digite seu email" {...field} />
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
                        placeholder="Digite sua senha"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={methods.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PasswordInput
                        placeholder="Confirme sua senha"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={methods.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value ?? false}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                    </FormControl>

                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Ao clicar em &quot;Criar conta&quot;, você aceita o
                        <a
                          href="#"
                          className="ml-1 font-medium text-primary underline"
                        >
                          termo de uso
                        </a>
                        , e a
                        <a
                          href="#"
                          className="ml-1 font-medium text-primary underline"
                        >
                          política de privacidade
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Registrar
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      <div className="flex items-center justify-center text-sm">
        <p className="text-center opacity-50">Já tem uma conta?</p>
        <Button variant="link" className="px-2" asChild>
          <Link to="/login">Faça login </Link>
        </Button>
      </div>
    </div>
  )
}

export default SignupPage
