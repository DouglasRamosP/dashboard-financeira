import { Navigate } from 'react-router'

import AddTransactionButton from '@/components/add-transaction-button'
import Balance from '@/components/balance'
import DateSelection from '@/components/date-selection'
import Header from '@/components/header'
import TransactionTypeChart from '@/components/transaction-type-chart'
import TransactionsTable from '@/components/transactions-table'

import { useAuthContext } from '../contexts/auth'

const HomePage = () => {
  const { user, loading } = useAuthContext()

  if (loading) {
    return <p>Carregando...</p>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen space-y-6 p-4 md:p-8">
      <Header />
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Ola, {user.firstName}
            </h1>
            <p className="text-sm text-muted-foreground">
              Seu dashboard financeiro esta pronto para acompanhar saldo,
              ganhos, gastos e investimentos.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <DateSelection />
            <div className="flex justify-end">
              <AddTransactionButton />
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
          <Balance />
          <TransactionTypeChart />
        </div>

        <TransactionsTable />
      </div>
    </div>
  )
}

export default HomePage
