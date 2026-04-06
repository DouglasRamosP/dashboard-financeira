import { TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { useDeleteTransactionAction } from '@/forms/hooks/transaction'

import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  'Nao foi possivel excluir a transacao.'

const DeleteTransactionButton = ({ transactionId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { deleteTransaction, isDeleting } = useDeleteTransactionAction()

  const handleDelete = async () => {
    try {
      await deleteTransaction.mutateAsync({ id: transactionId })
      setIsOpen(false)
      toast.success('Transacao excluida com sucesso!')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <TrashIcon />
      </Button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Excluir transacao</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Essa acao nao pode ser desfeita. Deseja continuar?
              </p>
              <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isDeleting}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Excluindo...' : 'Excluir'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  )
}

export default DeleteTransactionButton
