"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signup } from "@/lib/authService";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";

interface SignupFormState {
   studentId: string;
   name: string;
   password: string;
}

const formSchema = z.object({
   studentId: z
      .string()
      .regex(/^\d+$/, { message: "Student ID must contain only numbers." })
      .min(8, { message: "Student ID should be 8 characters long." }),
   name: z.string().min(2, {
      message: "Name must be at least 2 characters long.",
   }),
   password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[A-Z]/, {
         message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[@$!%*?&]/, {
         message: "Password must contain at least one special character.",
      }),
});

export default function Register() {
   const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
   const [showPassword, setShowPassword] = useState<boolean>(false);
   const { refetch } = useAuth();
   const router = useRouter();

   const form = useForm<SignupFormState>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         studentId: "",
         name: "",
         password: "",
      },
   });

   async function onSubmit() {
      setIsSigningUp(true);
      const [data, err] = await signup(form.getValues());

      if (data.success) {
         await refetch();
         router.refresh();
         setIsSigningUp(false);
         console.log("You successfully created an account!");
         toast.success(data.message);
      }

      if (!data.success) toast.error(data.message);
      setIsSigningUp(false);
   }

   const handleShowPassword = () => {
      if (showPassword) {
         setShowPassword(false);
      } else {
         setShowPassword(true);
      }
   };

   return (
      <div className="w-screen h-screen flex items-center justify-center bg-background">
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="h-full w-full lg:h-max lg:w-115 space-y-5 lg:border shadow-lg lg:rounded-xl px-8 lg:p-10 bg-secondary flex flex-col justify-center">
               <div className="flex flex-col items-center gap-3 mb-10">
                  <img className="h-13 lg:h-15" src="/logo.svg" alt="logo" />
                  <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
                     TrackNFind
                  </h1>
                  <small className="text-xs lg:text-sm text-muted-foreground leading-none font-medium">
                     Welcome! Create an account.
                  </small>
               </div>
               <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="ml-0.5">StudentID</FormLabel>
                        <FormControl>
                           <Input
                              maxLength={8}
                              placeholder="Ex. 12345678"
                              className="text-sm lg:text-base placeholder:text-sm lg:placeholder:text-base bg-background"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                           />
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
                        <FormLabel className="ml-0.5">Name</FormLabel>
                        <FormControl>
                           <Input
                              placeholder="Enter your name"
                              className="text-sm lg:text-base placeholder:text-sm lg:placeholder:text-base bg-background"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                           />
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
                        <FormLabel className="ml-0.5">Password</FormLabel>
                        <FormControl>
                           <div className="w-full h-max relative">
                              <Input
                                 type={showPassword ? "text" : "password"}
                                 placeholder="Enter your password"
                                 className="text-sm lg:text-base placeholder:text-sm lg:placeholder:text-base bg-background"
                                 {...field}
                                 onChange={(e) =>
                                    field.onChange(e.target.value)
                                 }
                              />
                              <Eye
                                 size={15}
                                 color="rgb(100,100,100)"
                                 className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${
                                    showPassword ? "visible" : "hidden"
                                 }`}
                                 onClick={handleShowPassword}
                              />
                              <EyeClosed
                                 size={15}
                                 color="rgb(100,100,100)"
                                 className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${
                                    showPassword ? "hidden" : "visible"
                                 }`}
                                 onClick={handleShowPassword}
                              />
                           </div>
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <Button
                  className="mt-8 w-full lg:py-5 text-white bg-blue-700 rounded-md hover:bg-blue-600 cursor-pointer disabled:opacity-50"
                  type="submit"
                  disabled={isSigningUp}>
                  {isSigningUp ? "Signing up" : "Sign up"}
               </Button>
               <div className="w-full flex items-center justify-center gap-2">
                  <hr className="w-full border-ring" />
                  <p className="text-sm text-primary leading-none font-medium">
                     or
                  </p>
                  <hr className="w-full border-ring" />
               </div>
               <Button
                  className="w-full lg:py-5 rounded-md cursor-pointer"
                  type="submit">
                  <img src="google--icon.png" alt="google icon" /> Continue with
                  Google
               </Button>
               <p className="text-center text-xs text-primary leading-none font-medium">
                  Already have an account?
                  <a
                     className="text-xs text-blue-500 leading-none font-medium cursor-pointer"
                     onClick={() => router.push("/login")}>
                     {" "}
                     Log In
                  </a>
               </p>
            </form>
         </Form>
      </div>
   );
}
