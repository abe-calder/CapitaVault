import {
  useQuery,
} from '@tanstack/react-query'
import getAssetDataByTicker, { getMarketHolidays } from '../apis/polygon'

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


// export function useGetHolidayData() {
//   return useQuery({
//     queryKey: ['upcomingMarketHolidays'],
//     queryFn: () => getMarketHolidays(),
//     staleTime: 750 * 60 * 60, // 45 mins
//     refetchInterval: 750 * 60 * 60, // 45 mins
//     refetchOnWindowFocus: false,
//   })
// }