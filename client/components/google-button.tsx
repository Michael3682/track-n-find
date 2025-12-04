"use client"

import { signInWithGoogle } from "@/lib/authService"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth/AuthContext"

const GoogleButton = () => {
    const router = useRouter()
    const { refetch } = useAuth()
    const handleSignIn = async () => {
        const [data] = await signInWithGoogle()
        console.log(data)
        if(!data.user) {
            return router.push(`/onboarding`)
        }

        await refetch()
        router.push('/')
    }
  return (
    <Button
        className="w-full lg:py-5 rounded-md cursor-pointer"
        type="button" onClick={() => handleSignIn()}
    >
        <img src="google--icon.png" alt="google icon" />
        Continue
        with Google
    </Button>
  )
}

export default GoogleButton