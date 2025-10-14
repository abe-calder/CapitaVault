import {
  useQuery,
} from '@tanstack/react-query'
import getAssetDataByTicker from '../apis/polygon' // Assuming this is the correct path

export function useGetAssetDataByTicker(ticker: string) {
  const query = useQuery({
    queryKey: ['polygonData', ticker],
    queryFn: async () => { // The API function expects an array of objects, not a string
      return getAssetDataByTicker([{ ticker }])
    },
    refetchOnWindowFocus: false,
    refetchInterval: 600000, // 10 minutes
  })
  return {
    ...query
  }
}
