import {
  useQuery,
  useQueries
} from '@tanstack/react-query'
import getAssetDataByTicker from '../apis/polygon'

export function useGetAssetDataByTicker(ticker: string) {
  const query = useQuery({
    queryKey: ['polygonData', ticker],
    queryFn: async () => {
      return getAssetDataByTicker(ticker)
    }
  })
  return {
    ...query
  }
}

interface Asset {
  ticker: string
}

export const useAssetsQueries = (userAssetData: Asset[] | undefined) => {
  const queries =
    userAssetData?.map((asset) => ({
      queryKey: ['assetData', asset.ticker],
      queryFn: () => getAssetDataByTicker(asset.ticker), // Replace with your actual fetch function
      enabled: !!userAssetData, // Conditionally enable the query
    })) ?? []

  const results = useQueries({ queries: queries })

  return { queries: results }
}
