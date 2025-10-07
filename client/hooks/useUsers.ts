import { useAuth0 } from '@auth0/auth0-react'
import { addUser, getUser, updateUser } from '../apis/users'
import { MutationFunction, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useUsers() {
  const { user, getAccessTokenSilently } = useAuth0()

  const query = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      return getUser({ token })
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
  })
  return {
    ...query,
    add: useAddUser()
  }
}

export function useUserMutation<TData = unknown, TVariables = unknown>(
  mutationFn: MutationFunction<TData, TVariables>,
) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  return mutation
}

export function useAddUser() {
  return useUserMutation(addUser)
}

export function useUpdateUser() {
  return useUserMutation(updateUser)
}