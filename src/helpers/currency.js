export const formatCurrency = (value) => {
  const parsedValue = Number(value ?? 0)

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number.isFinite(parsedValue) ? parsedValue : 0)
}
