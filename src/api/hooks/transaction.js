import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuthContext } from '@/contexts/auth'

import { TransactionService } from '../services/transaction'
import { getUserBalanceQueryKey } from './user'

export const getTransactionsQueryKey = ({ userId, from, to }) => {
  if (!from || !to) {
    return ['transactions', userId]
  }

  return ['transactions', userId, from, to]
}

export const useGetTransactions = ({ from, to }) => {
  const { user } = useAuthContext()

  return useQuery({
    queryKey: getTransactionsQueryKey({ userId: user?.id, from, to }),
    queryFn: () => TransactionService.getAll({ from, to }),
    enabled: Boolean(user?.id) && Boolean(from) && Boolean(to),
    retry: false,
  })
}

const invalidateDashboardQueries = ({ queryClient, userId }) => {
  queryClient.invalidateQueries({
    queryKey: getTransactionsQueryKey({ userId }),
    exact: false,
  })
  queryClient.invalidateQueries({
    queryKey: getUserBalanceQueryKey({ userId }),
    exact: false,
  })
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthContext()

  return useMutation({
    mutationFn: (input) => TransactionService.create(input),
    onSuccess: () => {
      invalidateDashboardQueries({ queryClient, userId: user?.id })
    },
  })
}

export const useEditTransaction = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthContext()

  return useMutation({
    mutationFn: (input) => TransactionService.update(input),
    onSuccess: () => {
      invalidateDashboardQueries({ queryClient, userId: user?.id })
    },
  })
}

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthContext()

  return useMutation({
    mutationFn: ({ id }) => TransactionService.delete({ id }),
    onSuccess: () => {
      invalidateDashboardQueries({ queryClient, userId: user?.id })
    },
  })
}
