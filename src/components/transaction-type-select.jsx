import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react'

import { Button } from './ui/button'

const options = [
  {
    value: 'EARNING',
    label: 'Ganho',
    icon: <TrendingUpIcon className="text-primary-green" />,
  },
  {
    value: 'EXPENSE',
    label: 'Gasto',
    icon: <TrendingDownIcon className="text-primary-red" />,
  },
  {
    value: 'INVESTMENT',
    label: 'Investimento',
    icon: <PiggyBankIcon className="text-primary-blue" />,
  },
]

const TransactionTypeSelect = ({ onChange, value }) => {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant={value === option.value ? 'secondary' : 'outline'}
          onClick={() => onChange(option.value)}
        >
          {option.icon}
          {option.label}
        </Button>
      ))}
    </div>
  )
}

export default TransactionTypeSelect
