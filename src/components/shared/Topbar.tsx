import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations"
import { useEffect } from "react"

const Topbar = () => {

  const { mutate: signOut, isSuccess } = useSignOutAccount()
  const navigate = useNavigate()

  useEffect(() => {
    if (isSuccess) {
      navigate(0)
    }
  }, [isSuccess, navigate])   // le navigate on peut l'enlever

  return (
    <section className=""> 
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img 
            src="/assets/images/logo4-1.png"
            alt="logo"
            width={230}
            height={325}
          />
        </Link>
      </div>
      <div className="flex gap-4">
        <Button variant="ghost" className="shad-button_ghost" onClick={() => signOut()}>
          <img 
            src="/assets/icons/logout2.svg"
            alt="logout"
            width={50}
            height={50}
          />
        </Button>
      </div>     
    </section>
  )
}

export default Topbar