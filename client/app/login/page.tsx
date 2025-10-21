'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"

interface FormState {
    studentid: string;
    password: string;
}

export default function Login() {
    const router = useRouter()


    const [form, setForm] = useState<FormState>({ studentid: '', password: '' })
    // const [message, setMessage] = useState('')
    // const [errors, setErrors] = useState({})

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        console.log("You Successfully Login")
    }
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <form className="w-120 px-10 py-7 flex flex-col gap-10 border rounded-md shadow-xl" onSubmit={handleSubmit}>
                <header className="flex flex-col items-center">
                    <img className="mb-2 w-10" src="track-n-find--logo.png" alt="logo" />
                    <p className="text-4xl font-bold">TrackNFind</p>
                    <p className="text-base text-gray-600">Welcome back! Login your account</p>
                </header>
                <div className="flex flex-col">
                    <label className="text-base font-medium text-lg mb-0.5" htmlFor="studentid">StudentID</label>
                    <input className="p-2 border rounded border-gray-300" name="studentid" id="studentid" type="text" placeholder="Ex. 12345678" value={form.studentid} onChange={handleInput} required />
                    <label className="text-base font-medium text-lg mt-3 mb-0.5" htmlFor="password">Password</label>
                    <input className="p-2 border rounded border-gray-300" name="password" id="password" type="password" placeholder="Enter your password" value={form.password} onChange={handleInput} required />
                </div>
                <div className="flex flex-col gap-4">
                    <button className="w-full py-2 text-md rounded bg-blue-700 text-white cursor-pointer transition-all duration-75 ease-linear hover:bg-blue-800" type="submit">Log In</button>
                    <div className="w-full flex items-center justify-center gap-5">
                        <hr className="w-full border-gray-400" />
                        <p className="leading-none">or</p>
                        <hr className="w-full border-gray-400" />
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 py-2 text-md rounded bg-gray-200 text-black cursor-pointer transition-all duration-75 ease-linear hover:bg-gray-300"><img src="google--icon.png" alt="google icon" /> Continue with Google</button>
                </div>
                <p className="text-center text-gray-600">Don't have an Account? <a className="text-blue-700 cursor-pointer" onClick={() => router.push('/register')}>Sign Up</a></p>
            </form>
        </div>
    )
}