import { useSearchParams } from 'react-router'

import { useGetTransactions } from '@/api/hooks/transaction'
import { formatCurrency } from '@/helpers/currency'
import { formatDisplayDate } from '@/helpers/date'

import DeleteTransactionButton from './delete-transaction-button'
import EditTransactionButton from './edit-transaction-button'
import TransactionTypeBadge from './transaction-type-badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

const getErrorMessage = (error) =>
  error?.response?.data?.message || 'Nao foi possivel carregar as transacoes.'

const TransactionsTable = () => {
  const [searchParams] = useSearchParams()
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const { data, error, isLoading } = useGetTransactions({ from, to })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transacoes</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">
            Carregando transacoes...
          </p>
        ) : null}

        {error ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {getErrorMessage(error)}
            </p>
          </div>
        ) : null}

        {!isLoading && !error && (!data || data.length === 0) ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma transacao encontrada para o periodo selecionado.
          </p>
        ) : null}

        {!isLoading && !error && data?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-sm text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Titulo</th>
                  <th className="py-3 pr-4 font-medium">Tipo</th>
                  <th className="py-3 pr-4 font-medium">Data</th>
                  <th className="py-3 font-medium">Valor</th>
                  <th className="py-3 pl-4 text-right font-medium">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {data.map((transaction) => (
                  <tr key={transaction.id} className="border-b last:border-0">
                    <td className="py-3 pr-4">{transaction.name}</td>
                    <td className="py-3 pr-4">
                      <TransactionTypeBadge
                        variant={transaction.type.toLowerCase()}
                      />
                    </td>
                    <td className="py-3 pr-4">
                      {formatDisplayDate(transaction.date)}
                    </td>
                    <td className="py-3 font-medium">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="py-3 pl-4">
                      <div className="flex justify-end gap-1">
                        <EditTransactionButton transaction={transaction} />
                        <DeleteTransactionButton
                          transactionId={transaction.id}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default TransactionsTable
