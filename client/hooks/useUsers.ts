import { useAuth0 } from "@auth0/auth0-react"
import { getUser } from "../apis/users"
import { useQuery } from "@tanstack/react-query"

export function useUsers() {
  const { user, getAccessTokenSilently } = useAuth0()

  const query = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      return getUser({ token })
    },
    enabled: !!user,
  })
  return {
    ...query,
  }
}