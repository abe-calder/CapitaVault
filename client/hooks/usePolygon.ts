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



// export const useAssetsQueries = (userAssetData: Asset[]) => {
//   const queries =
//     userAssetData?.map((asset) => ({
//       queryKey: ['assetData', asset.ticker],
//       queryFn: () => getAssetDataByTicker(asset.ticker), 
//       enabled: !!userAssetData, 
//     })) ?? []

//   const results = useQueries({ queries: queries })

//   return { queries: results }
// }
