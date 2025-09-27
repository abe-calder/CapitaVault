import {
  useQuery,
  useMutation,
  useQueryClient,
  MutationFunction,
} from '@tanstack/react-query'

import { addAssets, getUsersTickers } from '../apis/assets'
import { useAuth0 } from '@auth0/auth0-react'


export function useUsersTickers() {
  const { user, getAccessTokenSilently } = useAuth0()

  const query = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      return getUsersTickers(token)
    },
    enabled: !!user,
  })
  return {
    ...query,
  }
}


export function useAssetsMutation<TData = unknown, TVariables = unknown>(
  mutationFn: MutationFunction<TData, TVariables>,
) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addAssets']})
    }
  })
  return mutation
}



export function useAddAssets() {
  return useAssetsMutation(addAssets)
}