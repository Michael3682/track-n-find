"use client";

import { z } from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { login } from "@/lib/authService"
import { useAuth } from "@/contexts/auth/AuthContext"

interface LoginFormState {
    studentId: string
    password: string
}

const formSchema = z.object({
    studentId: z.string()
        .regex(/^\d+$/, { message: "Student ID must contain only numbers." })
        .min(8, { message: "Student ID should be 9 characters long." }),
    password: z.string() //Will be change 
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
        .regex(/[0-9]/, { message: "Password must contain at least one number." })
        .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character." })
})

export default function Login() {
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false)
    const router = useRouter()
    const { refetch } = useAuth()

    const form = useForm<LoginFormState>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            studentId: "",
            password: "",
        },
    })

    async function onSubmit() {
        setIsLoggingIn(true)
        const [data, err] = await login(form.getValues())
    
        if(data.success) {
            await refetch()
            router.refresh()
            setIsLoggingIn(false)
            console.log("You successfully logged in!")
        }

        setIsLoggingIn(false)
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-[rgb(245,245,245)]">
            <div className="border border-black/30 shadow-lg rounded-xl p-10 bg-white">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <div className="flex flex-col items-center gap-3 mb-10">
                            <img src="track-n-find--logo.png" alt="logo" />
                            <h1 className="text-4xl font-extrabold tracking-tight">
                                TrackNFind
                            </h1>
                            <small className="text-sm text-black/80 leading-none font-medium">Welcome back! Login to your account.</small>
                        </div>
                        <FormField
                            control={form.control}
                            name="studentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Student ID</FormLabel>
                                    <FormControl>
                                        <Input maxLength={9} placeholder="Ex. 123456789" {...field} onChange={e => field.onChange(e.target.value)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter your password" {...field} onChange={e => field.onChange(e.target.value)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="mt-10 w-100 bg-blue-700 rounded-md hover:bg-blue-600 cursor-pointer disabled:opacity-50" type="submit" disabled={isLoggingIn}>{isLoggingIn ? 'Logging in' : "Log in"}</Button>
                        <div className="w-full flex items-center justify-center gap-2">
                            <hr className="w-full border-gray-400" />
                            <p className="text-sm text-black/80 leading-none font-medium">or</p>
                            <hr className="w-full border-gray-400" />
                        </div>
                        <Button className="w-100 rounded-md cursor-pointer" type="submit"><img src="google--icon.png" alt="google icon" /> Continue with Google</Button>
                        <p className="text-center text-sm text-black/80 leading-none font-medium">
                            Don't have an account?
                            <a className="text-sm text-blue-700 leading-none font-medium cursor-pointer" onClick={() => router.push('/register')}> Sign Up</a>
                        </p>
                    </form>
                </Form>
            </div>
        </div>
    )
}
