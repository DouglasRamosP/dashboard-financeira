import { api } from '@/lib/axios'

const API_TYPE_BY_UI_TYPE = {
  EARNING: 'EARNINGS',
  EXPENSE: 'EXPENSES',
  INVESTMENT: 'INVESTMENTS',
}

const UI_TYPE_BY_API_TYPE = {
  EARNINGS: 'EARNING',
  EXPENSES: 'EXPENSE',
  INVESTMENTS: 'INVESTMENT',
}

const toNumber = (value) => {
  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : 0
}

const toApiType = (value) => API_TYPE_BY_UI_TYPE[value] ?? value

const toUiType = (value) => UI_TYPE_BY_API_TYPE[value] ?? value

const normalizeDate = (value) => {
  if (value instanceof Date) {
    const year = value.getFullYear()
    const month = `${value.getMonth() + 1}`.padStart(2, '0')
    const day = `${value.getDate()}`.padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  return value
}

const normalizeTransaction = (payload) => ({
  id: payload?.id ?? '',
  name: payload?.name ?? '',
  type: toUiType(payload?.type ?? 'EARNING'),
  amount: toNumber(payload?.amount),
  date: payload?.date ?? '',
})

export const TransactionService = {
  getAll: async ({ from, to }) => {
    const response = await api.get('api/transactions/me', {
      params: { from, to },
    })

    return Array.isArray(response.data)
      ? response.data.map(normalizeTransaction)
      : []
  },
  create: async (input) => {
    const response = await api.post('api/transactions/me', {
      ...input,
      date: normalizeDate(input.date),
      type: toApiType(input.type),
    })

    return normalizeTransaction(response.data)
  },
  update: async ({ id, ...input }) => {
    const response = await api.patch(`api/transactions/me/${id}`, {
      ...input,
      date: normalizeDate(input.date),
      type: toApiType(input.type),
    })

    return normalizeTransaction(response.data)
  },
  delete: async ({ id }) => {
    await api.delete(`api/transactions/me/${id}`)
  },
}
