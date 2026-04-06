import { api } from '@/lib/axios'

const toNumber = (value) => {
  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : 0
}

const normalizeUser = (payload) => ({
  id: payload?.id ?? '',
  email: payload?.email ?? '',
  firstName: payload?.firstName ?? payload?.first_name ?? '',
  lastName: payload?.lastName ?? payload?.last_name ?? '',
})

const normalizeBalance = (payload) => ({
  balance: toNumber(payload?.balance),
  earnings: toNumber(payload?.earnings),
  expenses: toNumber(payload?.expenses),
  investments: toNumber(payload?.investments),
  earningsPercentage: toNumber(payload?.earningsPercentage),
  expensesPercentage: toNumber(payload?.expensesPercentage),
  investmentsPercentage: toNumber(payload?.investmentsPercentage),
})

export const UserService = {
  me: async () => {
    const response = await api.get('api/users/me')

    return normalizeUser(response.data)
  },
  getBalance: async ({ from, to }) => {
    const response = await api.get('api/users/me/balance', {
      params: { from, to },
    })

    return normalizeBalance(response.data)
  },
}
