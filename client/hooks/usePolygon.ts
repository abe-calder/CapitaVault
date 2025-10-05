import {
  useQuery,
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
