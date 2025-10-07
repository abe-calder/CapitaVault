import { createContext, useContext, ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useUsers } from '../hooks/useUsers'
import { useGetAssets } from '../hooks/useAssets'
import getAssetDataByTicker from '../apis/polygon'
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

export function PolygonDataProvider({ children }: { children: ReactNode }) {
  const { data: userData, isPending: isUserPending } = useUsers()
  const userId = userData?.id

  const { data: userAssetData = [], isPending: areAssetsPending } =
    useGetAssets(userId)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['polygonMarketData', userAssetData],
    queryFn: () => getAssetDataByTicker(userAssetData),
    enabled: userAssetData.length > 0,
    staleTime: REFETCH_INTERVAL,
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: false,
  })

  const value = {
    polygonData: data || [],
    isLoading: isUserPending || areAssetsPending || isLoading,
    error: isError ? (error as Error).message : null,
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
