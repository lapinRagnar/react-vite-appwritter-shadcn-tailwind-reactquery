import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations"
import { useEffect } from "react"
import { useUserContext } from "@/context/AuthContext"

const Topbar = () => {

  const { mutate: signOut, isSuccess } = useSignOutAccount()
  const navigate = useNavigate()
  const { user } = useUserContext()

  useEffect(() => {
    if (isSuccess) {
      navigate(0)
    }
  }, [isSuccess, navigate])   // le navigate on peut l'enlever

  return (
    <section className="topbar"> 
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img 
            src="/assets/images/logo4-1.png"
            alt="logo"
            width={100}
            height={100}
          />
        </Link>
      
        <div className="flex gap-1">
          <Button variant="ghost" className="shad-button_ghost" onClick={() => signOut()}>
            <img 
              src="/assets/icons/logout2.svg"
              alt="logout"
              width={30}
              height={30}
            />
          </Button>

          <Link to={`/profile/${user?.id}`} className="flex-center gap-3">
            <img 
              src={user.imageUrl || '/assets/images/avatar.svg'}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>

        </div>
      </div>     
    </section>
  )
}

export default Topbar