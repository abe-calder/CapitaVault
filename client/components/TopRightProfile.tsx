import { useAuth0 } from "@auth0/auth0-react"
import { useUsers } from "../hooks/useUsers"

export default function TopRightProfile() {
  const { user } = useAuth0()
  const getMe = useUsers()
  const userName = getMe.data?.username

  return (
    <div className="profile">
      {user && (
        <object type="image/jpeg" data={user.picture} className="profile-photo">
          <img
            src="/images/profile-photo-fallback.webp"
            alt="fallback-img"
          ></img>
        </object>
      )}
      {getMe && <h1 className="profile-name">{userName}</h1>}
    </div>
  )
}
