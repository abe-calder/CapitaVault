import {
  useQuery,
  useMutation,
  useQueryClient,
  MutationFunction,
  UseQueryOptions,
} from '@tanstack/react-query'

import {
  addAssets,
  deleteAssetById,
  getAssetsByUserId,
  getUsersTickers,
} from '../apis/assets'
import { AssetData } from '../../models/assets'
import { useAuth0 } from '@auth0/auth0-react'

export function useUsersTickers() {
  const { user, getAccessTokenSilently } = useAuth0()

  const query = useQuery({
    queryKey: ['usersTickers'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      return getUsersTickers(token)
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
    refetchInterval: 600000, // 10 minutes
  })
  return {
    ...query,
  }
}

interface GetAssetByUserIdFunction {
  userId: number
  token: string
}

export function useGetAssets(
  userId: number | undefined,
  options?: UseQueryOptions<AssetData[]>,
) {
  const { user, getAccessTokenSilently } = useAuth0()

  return useQuery({
    queryKey: ['getAssetsByUserId', userId],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      return getAssetsByUserId({ userId, token } as GetAssetByUserIdFunction)
    },
    // Combine the base requirement with any options passed in
    enabled: !!user && (options?.enabled ?? true),
    ...options,
  })
}

export function useAssetsMutation<TData = unknown, TVariables = unknown>(
  mutationFn: MutationFunction<TData, TVariables>,
) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addAssets'] })
    },
  })
  return mutation
}

export function useAddAssets() {
  return useAssetsMutation(addAssets)
}

export function useDeleteAssetById() {
  return useAssetsMutation(deleteAssetById)
}
