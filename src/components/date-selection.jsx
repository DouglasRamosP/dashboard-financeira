import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { getCurrentMonthRange } from '@/helpers/date'

import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Input } from './ui/input'

const getInitialState = (searchParams) => {
  const defaultRange = getCurrentMonthRange()

  return {
    from: searchParams.get('from') ?? defaultRange.from,
    to: searchParams.get('to') ?? defaultRange.to,
  }
}

const DateSelection = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [range, setRange] = useState(() => getInitialState(searchParams))

  useEffect(() => {
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    if (from && to) {
      setRange({ from, to })
      return
    }

    const defaultRange = getCurrentMonthRange()
    navigate(`/?from=${defaultRange.from}&to=${defaultRange.to}`, {
      replace: true,
    })
  }, [navigate, searchParams])

  const handleApply = () => {
    if (!range.from || !range.to) {
      return
    }

    navigate(`/?from=${range.from}&to=${range.to}`)
  }

  return (
    <Card className="w-full md:w-auto">
      <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-end">
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">De</label>
          <Input
            type="date"
            value={range.from}
            onChange={(event) =>
              setRange((current) => ({ ...current, from: event.target.value }))
            }
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">Ate</label>
          <Input
            type="date"
            value={range.to}
            onChange={(event) =>
              setRange((current) => ({ ...current, to: event.target.value }))
            }
          />
        </div>
        <Button onClick={handleApply}>Aplicar periodo</Button>
      </CardContent>
    </Card>
  )
}

export default DateSelection
