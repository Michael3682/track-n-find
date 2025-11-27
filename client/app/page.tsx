"use client"

import Homepage from "@/components/pages/HomePage";
import { useAuth } from "@/contexts/auth/AuthContext";
import LandingPage from "@/components/pages/LandingPage";


export default function Home() {
  const { user } = useAuth()

  if(!user) return <LandingPage />
  return <Homepage />
}
