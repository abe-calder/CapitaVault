import { createContext, ReactNode, useContext, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMarketHolidays } from '../apis/polygon'

interface MarketHolidaysState {
  marketHolidays: {
    name: string
    date: string
    status: string
  }[]
  isLoading: boolean
  error: Error | string | null
}

const MarketHolidaysContext = createContext<MarketHolidaysState | undefined>(
  undefined,
)

export function MarketHolidaysProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['upcomingMarketHolidays'],
    queryFn: () => getMarketHolidays(),
    staleTime: 750 * 60 * 60, // 45 mins
    refetchInterval: 750 * 60 * 60, // 45 mins
    refetchOnWindowFocus: false,
  })

  const sortedMarketHolidays = useMemo(() => {
    if (data) {
      return [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      )
    }
    return 
  }, [data])


  const value: MarketHolidaysState = {
    marketHolidays: sortedMarketHolidays || [],
    isLoading,
    error: error || null,
  }

  return (
    <MarketHolidaysContext.Provider value={value}>
      {children}
    </MarketHolidaysContext.Provider>
  )
}

export function useMarketHolidays() {
  const context = useContext(MarketHolidaysContext)
  if (context === undefined) {
    throw new Error(
      'useMarketHolidays must be used within a MarketHolidaysProvider',
    )
  }
  return context
}
