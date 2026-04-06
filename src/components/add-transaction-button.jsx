import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useCreateTransactionForm } from '@/forms/hooks/transaction'

import TransactionFormModal from './transaction-form-modal'

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  'Nao foi possivel criar a transacao.'

const AddTransactionButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { form, isSubmitting, onSubmit } = useCreateTransactionForm({
    onSuccess: () => {
      setIsOpen(false)
      toast.success('Transacao criada com sucesso!')
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
      <Button onClick={() => setIsOpen(true)}>
        <PlusIcon />
        Nova transacao
      </Button>

      <TransactionFormModal
        form={form}
        isOpen={isOpen}
        isSubmitting={isSubmitting}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        submitLabel="Criar transacao"
        title="Nova transacao"
      />
    </>
  )
}

export default AddTransactionButton
