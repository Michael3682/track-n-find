"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { signup } from "@/lib/authService";
import { useAuth } from "@/contexts/auth/AuthContext";

interface SignupFormState {
    studentId: string
    name: string
    password: string
}

const formSchema = z.object({
    studentId: z.string()
        .regex(/^\d+$/, { message: "Student ID must contain only numbers." })
        .min(8, { message: "Student ID should be 8 characters long." }),
    name: z.string().min(2, {
        message: "Name must be at least 2 characters long."
    }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
        .regex(/[0-9]/, { message: "Password must contain at least one number." })
        .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character." })
})

export default function Register() {
    const [isSigningUp, setIsSigningUp] = useState<boolean>(false)
    const { refetch } = useAuth()
    const router = useRouter()

    const form = useForm<SignupFormState>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            studentId: "",
            name: "",
            password: "",
        },
    })

    async function onSubmit() {
        setIsSigningUp(true)
        const [data, err] = await signup(form.getValues())
    
        if(data.success) {
            await refetch()
            router.refresh()
            setIsSigningUp(false)
            console.log("You successfully created an account!")
        }

        setIsSigningUp(false)
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-[rgb(245,245,245)]">
            <div className="border border-black/30 shadow-lg rounded-xl p-10 bg-white">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <div className="flex flex-col items-center gap-1 mb-10">
                            <img src="track-n-find--logo.png" alt="logo" />
                            <h1 className="text-4xl font-extrabold tracking-tight">
                                TrackNFind
                            </h1>
                            <small className="text-sm text-black/80 leading-none font-medium">Welcome! Create an account.</small>
                        </div>
                        <FormField
                            control={form.control}
                            name="studentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>StudentID</FormLabel>
                                    <FormControl>
                                        <Input maxLength={9} placeholder="Ex. 123456789" {...field} onChange={e => field.onChange(e.target.value)}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your name" {...field} onChange={e => field.onChange(e.target.value)}/>
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
                                        <Input type="password" placeholder="Enter your password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="mt-10 w-100 bg-blue-700 rounded-md hover:bg-blue-600 cursor-pointer disabled:opacity-50" type="submit" disabled={isSigningUp}>{isSigningUp ? 'Signing up' : "Sign up"}</Button>
                        <div className="w-full flex items-center justify-center gap-2">
                            <hr className="w-full border-gray-400" />
                            <p className="text-sm text-black/80 leading-none font-medium">or</p>
                            <hr className="w-full border-gray-400" />
                        </div>
                        <Button className="w-100 rounded-md cursor-pointer" type="submit"><img src="google--icon.png" alt="google icon" /> Continue with Google</Button>
                        <p className="text-center text-sm text-black/80 leading-none font-medium">
                            Already have an account?
                            <a className="text-sm text-blue-700 leading-none font-medium cursor-pointer" onClick={() => router.push('/login')}> Log In</a>
                        </p>
                    </form>
                </Form>
            </div>
        </div>
    )
}
