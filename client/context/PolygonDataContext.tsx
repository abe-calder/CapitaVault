import { createContext, useContext, ReactNode, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import getAssetDataByTicker from '../apis/polygon'
import { AssetData } from '../../models/assets'
import { Results } from '../../models/polygon'

const REFETCH_INTERVAL = 500 * 60 * 60 // 1 hour

interface PolygonDataContextState {
  polygonData: Results[]
  isLoading: boolean
  error: string | null
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


  const value: PolygonDataContextState = useMemo(
    () => ({
      polygonData: data || [],
      isLoading: isLoading,
      error: isError ? (error as Error).message : null,
    }),
    [
      data,
      isLoading,
      isError,
      error,

    ],
  )

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
