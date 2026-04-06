import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react'
import { useSearchParams } from 'react-router'

import { useGetUserBalance } from '@/api/hooks/user'

import TransactionTypeChartLabel from './transaction-type-chart-label'
import TransactionTypeIcon from './transaction-type-icon'
import { Card, CardContent } from './ui/card'

const ProgressBar = ({ className, value }) => {
  return (
    <div className="h-2 w-full rounded-full bg-muted">
      <div
        className={className}
        style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
      />
    </div>
  )
}

const TransactionTypeChart = () => {
  const [searchParams] = useSearchParams()
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const { data, error, isLoading } = useGetUserBalance({ from, to })

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Carregando distribuicao financeira...
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="space-y-2 p-6">
          <h3 className="text-lg font-semibold">Distribuicao por tipo</h3>
          <p className="text-sm text-muted-foreground">
            O backend atual ainda nao retornou os dados do grafico.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div>
          <h3 className="text-lg font-semibold">Distribuicao por tipo</h3>
          <p className="text-sm text-muted-foreground">
            Resumo percentual do periodo selecionado.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <TransactionTypeChartLabel
              icon={
                <TransactionTypeIcon
                  icon={
                    <TrendingUpIcon className="text-primary-green" size={16} />
                  }
                  label="Ganhos"
                />
              }
              value={`${data?.earningsPercentage ?? 0}%`}
            />
            <ProgressBar
              className="h-2 rounded-full bg-primary-green"
              value={data?.earningsPercentage ?? 0}
            />
          </div>

          <div className="space-y-2">
            <TransactionTypeChartLabel
              icon={
                <TransactionTypeIcon
                  icon={
                    <TrendingDownIcon className="text-primary-red" size={16} />
                  }
                  label="Gastos"
                />
              }
              value={`${data?.expensesPercentage ?? 0}%`}
            />
            <ProgressBar
              className="h-2 rounded-full bg-primary-red"
              value={data?.expensesPercentage ?? 0}
            />
          </div>

          <div className="space-y-2">
            <TransactionTypeChartLabel
              icon={
                <TransactionTypeIcon
                  icon={
                    <PiggyBankIcon className="text-primary-blue" size={16} />
                  }
                  label="Investimentos"
                />
              }
              value={`${data?.investmentsPercentage ?? 0}%`}
            />
            <ProgressBar
              className="h-2 rounded-full bg-primary-blue"
              value={data?.investmentsPercentage ?? 0}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TransactionTypeChart
