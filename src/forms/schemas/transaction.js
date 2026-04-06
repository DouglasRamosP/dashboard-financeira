import { z } from 'zod'

const validDateRegex = /^\d{4}-\d{2}-\d{2}$/
const minimumYear = 2000

const isValidTransactionDate = (value) => {
  if (!validDateRegex.test(value)) {
    return false
  }

  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return false
  }

  return date.getFullYear() >= minimumYear
}

export const transactionFormSchema = z.object({
  name: z.string().trim().min(1, {
    message: 'O nome da transacao e obrigatorio.',
  }),
  amount: z.coerce.number().positive({
    message: 'Informe um valor maior que zero.',
  }),
  date: z.string().trim().refine(isValidTransactionDate, {
    message: 'Selecione uma data valida a partir do ano 2000.',
  }),
  type: z.enum(['EARNING', 'EXPENSE', 'INVESTMENT']),
})

export const editTransactionFormSchema = transactionFormSchema.extend({
  id: z.string().trim().min(1),
})
