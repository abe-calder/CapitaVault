import { createContext, useContext, ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import getAssetDataByTicker, { getMarketHolidays } from '../apis/polygon'
import { AssetData } from '../../models/assets'
import { Results } from '../../models/polygon'

const REFETCH_INTERVAL = 500 * 60 * 60 // 1 hour

interface PolygonDataContextState {
  polygonData: Results[]
  isLoading: boolean
  error: string | null
  marketHolidayData: string[] | null
  isHolidayLoading: boolean
  isHolidayError: boolean
  holidayError: Error | null
}

const PolygonDataContext = createContext<PolygonDataContextState | undefined>(
  undefined,
)

export function PolygonDataProvider({
  children,
  assets,
}: {
  children: ReactNode
  assets: AssetData[]
}) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['polygonMarketData', assets],
    queryFn: () => getAssetDataByTicker(assets),
    enabled: assets.length > 0,
    staleTime: REFETCH_INTERVAL,
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: false,
  })

  const {
    data: marketHolidayData,
    isLoading: isHolidayLoading,
    isError: isHolidayError,
    error: holidayError,
  } = useQuery({
    queryKey: ['upcomingMarketHolidays'],
    queryFn: () => getMarketHolidays(),
    enabled: true,
    staleTime: 750 * 60 * 60, // 45 mins
    refetchInterval: 750 * 60 * 60, // 45 mins
    refetchOnWindowFocus: false,
  })

  const value = {
    polygonData: data || [],
    isLoading: isLoading,
    error: isError ? (error as Error).message : null,
    marketHolidayData: marketHolidayData || [],
    isHolidayLoading: isHolidayLoading,
    holidayError: holidayError,
    isHolidayError: isHolidayError
  }

  return (
    <PolygonDataContext.Provider value={value}>
      {children}
    </PolygonDataContext.Provider>
  )
}

export function usePolygonDataContext() {
  const context = useContext(PolygonDataContext)
  if (context === undefined) {
    throw new Error(
      'usePolygonDataContext must be used within a PolygonDataProvider',
    )
  }
  return context
}
