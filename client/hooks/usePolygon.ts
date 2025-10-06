import {
  useQuery,
} from '@tanstack/react-query'
import getAssetDataByTicker from '../apis/polygon'

export function useGetAssetDataByTicker(ticker: string) {
  const query = useQuery({
    queryKey: ['polygonData', ticker],
    queryFn: async () => {
      return getAssetDataByTicker(ticker)
    },
    refetchOnWindowFocus: false,
    refetchInterval: 600000, // 10 minutes
  })
  return {
    ...query
  }
}
