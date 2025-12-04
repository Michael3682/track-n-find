"use client"

import { saveId } from "@/lib/authService"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useState } from "react"
import { auth } from "@/lib/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { User } from "firebase/auth"

const page = () => {
    const [isFormShowing, setIsFormShowing] = useState(false)
    const [role, setRole] = useState<"Teacher" | "Student" | "">("")
    const [formValue, setFormValue] = useState("")
    const [error, setError] = useState("")
    const [user] = useAuthState(auth)
    const router = useRouter()

    const handleLoginAsStudent = () => {
        setRole("Student")
        setIsFormShowing(true)
    }

    const handleLoginAsTeacher = () => {
        setRole("Teacher")
        setIsFormShowing(true)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        setError("")

        if (!/^\d+$/.test(formValue)) {
            return setError("Student ID must contain only numbers.")
        }

        if(formValue.length !== 8) {
            return setError("Student ID should be 8 characters long.")
        }

        if(!user?.email || !user?.displayName) {
            return setError("Email or Display Name is not defined. Please sign in with google first.")
        }

        const [data] = await saveId(formValue, user?.email, user?.displayName)

        if(data.success) {
            router.push("/")
        }
    }
    
    if(!user?.email) return <div>Email Required</div>

  return (
    <div className="flex flex-col h-screen justify-center items-center gap-10">
        <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-bold">Welcome to TrackNFind</h1>
            <h2 className="text-lg font-semibold text-gray-500">What brings you here?</h2>
        </div>
        {isFormShowing ? 
            <form className="w-100 flex flex-col gap-2" onSubmit={handleSubmit}>
                <div className="hover:underline cursor-pointer" onClick={() => setIsFormShowing(false)}>Back</div>
                <label htmlFor="id" className="font-bold text-sm">{role} ID</label>
                <input type="text" value={formValue} placeholder={`Enter ${role} ID`} onChange={e => setFormValue(e.target.value)} className="border py-2 px-4 rounded" required/>
                <span className="text-sm text-red-500">{!!error && error}</span>
                <button className="bg-blue-700 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-700">Save</button>
            </form>
        :
            <div className="flex gap-8">
                <div className="border h-75 aspect-3/4 rounded-lg p-4 shadow-md cursor-pointer hover:shadow-xl" onClick={() => handleLoginAsStudent()}>
                    <h3 className="font-bold text-lg mb-3">I am a student</h3>
                    <p className="text-sm text-gray-600">I am currently studying at Cordova Public College.</p>
                </div>
                <div className="border h-75 aspect-3/4 rounded-lg p-4 shadow-md cursor-pointer hover:shadow-xl" onClick={() => handleLoginAsTeacher()}>
                    <h3 className="font-bold text-lg mb-3">I am a teacher</h3>
                    <p className="text-sm text-gray-600">I teach wonderful students at Cordova Public College.</p>
                </div>
            </div>
        }
    </div>
  )
}

export default page