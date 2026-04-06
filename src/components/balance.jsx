import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from 'lucide-react'
import { useSearchParams } from 'react-router'

import { useGetUserBalance } from '@/api/hooks/user'

import BalanceItem from './balance-item'
import { Card, CardContent } from './ui/card'

const Balance = () => {
  const [searchParams] = useSearchParams()
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const { data, error, isLoading } = useGetUserBalance({ from, to })

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Carregando resumo financeiro...
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="space-y-2 p-6">
          <h3 className="text-lg font-semibold">Resumo financeiro</h3>
          <p className="text-sm text-muted-foreground">
            Nao foi possivel carregar o saldo com o backend atual.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <BalanceItem
        amount={data?.balance}
        icon={<WalletIcon size={16} />}
        label="Saldo"
      />
      <BalanceItem
        amount={data?.earnings}
        icon={<TrendingUpIcon className="text-primary-green" size={16} />}
        label="Ganhos"
      />
      <BalanceItem
        amount={data?.expenses}
        icon={<TrendingDownIcon className="text-primary-red" size={16} />}
        label="Gastos"
      />
      <BalanceItem
        amount={data?.investments}
        icon={<PiggyBankIcon className="text-primary-blue" size={16} />}
        label="Investimentos"
      />
    </div>
  )
}

export default Balance
