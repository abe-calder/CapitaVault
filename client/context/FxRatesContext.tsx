import { createContext, useContext, ReactNode, useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import getConversionRate from '../apis/fxrates.ts'

// The list of currencies to get rates for, relative to USD.
const TARGET_CURRENCIES = ['NZD', 'AUD', 'EUR', 'GBP'] // Exclude USD 
const REFETCH_INTERVAL = 1000 * 60 * 60 // 1 hour in milliseconds

interface FxRatesState {
  rates: Record<string, number>
  isLoading: boolean
  error: string | null
}

const FxRatesContext = createContext<FxRatesState | undefined>(undefined)

export function FxRatesProvider({ children }: { children: ReactNode }) {
  const queries = useMemo(
    () =>
      TARGET_CURRENCIES.map((targetCurrency) => ({
        queryKey: ['fxRate', 'USD', targetCurrency],
        queryFn: () =>
          getConversionRate({ from: 'USD', to: targetCurrency, amount: 1 }),
        staleTime: REFETCH_INTERVAL,
        refetchInterval: REFETCH_INTERVAL,
        refetchOnWindowFocus: false,
        retry: 3,
      })),
    [],
  )

  const currencyQueries = useQueries({
    queries: queries,
  })

  const value = useMemo(() => {
    const rates: Record<string, number> = { USD: 1 }
    let isLoading = false
    let error: string | null = null
    let hasError = false

    currencyQueries.forEach((query, index) => {
      if (query.isPending) {
        isLoading = true
      }
      if (query.isError && !hasError) {
        hasError = true
        error = (query.error as Error).message
      }
      if (query.data?.result && typeof query.data.result === 'number') {
        rates[TARGET_CURRENCIES[index]] = query.data.result
      }
    })
    return { rates, isLoading, error }
  }, [currencyQueries])

  return (
    <FxRatesContext.Provider value={value}>{children}</FxRatesContext.Provider>
  )
}

export function useFxRatesContext() {
  const context = useContext(FxRatesContext)
  if (context === undefined) {
    throw new Error('useFxRatesContext must be used within a FxRatesProvider')
  }
  return context
}
