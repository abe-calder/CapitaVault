export function formatCurrency(value: number, currency: string): string {
  return `${currency} ${value.toFixed(2)}`
}
