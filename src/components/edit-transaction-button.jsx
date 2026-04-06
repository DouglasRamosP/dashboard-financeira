import { PencilIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { useEditTransactionForm } from '@/forms/hooks/transaction'

import TransactionFormModal from './transaction-form-modal'
import { Button } from './ui/button'

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  'Nao foi possivel atualizar a transacao.'

const EditTransactionButton = ({ transaction }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { form, isSubmitting, onSubmit } = useEditTransactionForm({
    transaction,
    onSuccess: () => {
      setIsOpen(false)
      toast.success('Transacao atualizada com sucesso!')
    },
  })

  const handleSubmit = async (data) => {
    try {
      await onSubmit(data)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <PencilIcon />
      </Button>

      <TransactionFormModal
        form={form}
        isOpen={isOpen}
        isSubmitting={isSubmitting}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        submitLabel="Salvar alteracoes"
        title="Editar transacao"
      />
    </>
  )
}

export default EditTransactionButton
