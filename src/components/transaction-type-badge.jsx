import { cva } from 'class-variance-authority'
import { CircleIcon } from 'lucide-react'

const badgeVariants = cva(
  'flex w-fit items-center gap-1.5 rounded-full bg-muted px-2 py-[2px] text-xs font-bold',
  {
    variants: {
      variant: {
        earning: 'text-primary-green',
        expense: 'text-primary-red',
        investment: 'text-primary-blue',
      },
    },
    defaultVariants: {
      variant: 'earning',
    },
  }
)

const getLabel = (variant) => {
  switch (variant) {
    case 'expense':
      return 'Gasto'
    case 'investment':
      return 'Investimento'
    default:
      return 'Ganho'
  }
}

const TransactionTypeBadge = ({ variant }) => {
  return (
    <div className={badgeVariants({ variant })}>
      <CircleIcon size={10} className="fill-current" />
      {getLabel(variant)}
    </div>
  )
}

export default TransactionTypeBadge
