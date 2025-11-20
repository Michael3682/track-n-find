"use client"

import LandingPage from "@/components/pages/LandingPage";
import Homepage from "@/components/pages/HomePage";
import { useAuth } from "@/contexts/auth/AuthContext";


export default function Home() {
  const { user } = useAuth()

  if(!user) return <LandingPage />
  return <Homepage />
}
