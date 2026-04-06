import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import {
  useCreateTransaction,
  useDeleteTransaction,
  useEditTransaction,
} from '@/api/hooks/transaction'
import { formatDateInputValue } from '@/helpers/date'

import {
  editTransactionFormSchema,
  transactionFormSchema,
} from '../schemas/transaction'

const getDefaultValues = (transaction) => ({
  id: transaction?.id ?? '',
  name: transaction?.name ?? '',
  amount: transaction?.amount ?? '',
  date: transaction?.date?.split('T')[0] ?? formatDateInputValue(new Date()),
  type: transaction?.type ?? 'EARNING',
})

export const useCreateTransactionForm = ({ onSuccess }) => {
  const createTransaction = useCreateTransaction()
  const form = useForm({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: getDefaultValues(),
  })

  const onSubmit = async (data) => {
    const result = await createTransaction.mutateAsync(data)
    form.reset(getDefaultValues())
    onSuccess?.(result)
  }

  return {
    form,
    onSubmit,
    isSubmitting: createTransaction.isPending,
  }
}

export const useEditTransactionForm = ({ transaction, onSuccess }) => {
  const editTransaction = useEditTransaction()
  const form = useForm({
    resolver: zodResolver(editTransactionFormSchema),
    defaultValues: getDefaultValues(transaction),
  })

  useEffect(() => {
    form.reset(getDefaultValues(transaction))
  }, [form, transaction])

  const onSubmit = async (data) => {
    const result = await editTransaction.mutateAsync(data)
    onSuccess?.(result)
  }

  return {
    form,
    onSubmit,
    isSubmitting: editTransaction.isPending,
  }
}

export const useDeleteTransactionAction = () => {
  const deleteTransaction = useDeleteTransaction()

  return {
    deleteTransaction,
    isDeleting: deleteTransaction.isPending,
  }
}
