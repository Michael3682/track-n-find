"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
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
import { useAuth } from "@/contexts/auth/AuthContext";
import { toast } from "sonner";
import { changePassword } from "@/lib/authService";

interface ChangePasswordState {
   userId: string;
   password: string;
}

const formSchema = z.object({
   userId: z.string(),
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

export default function ChangePassword() {
   const [isSaving, setIsSaving] = useState<boolean>(false);
   const [showPassword, setShowPassword] = useState<boolean>(false);
   const router = useRouter();
   const { refetch } = useAuth();
   const { id } = useParams();

   const form = useForm<ChangePasswordState>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         userId: "",
         password: "",
      },
   });

   async function onSubmit() {
      setIsSaving(true);

      const { userId, password } = form.getValues();
      const [data, err] = await changePassword(userId, password);

      if (data.success) {
         await refetch();
         router.refresh();
         setIsSaving(false);
         console.log("Password successfully changed!");
         toast.success(data.message);

         router.back();
      }

      if (!data.success) toast.error(data.message);
      setIsSaving(false);
   }

   const handleShowPassword = () => {
      if (showPassword) {
         setShowPassword(false);
      } else {
         setShowPassword(true);
      }
   };

   useEffect(() => {
      if (!id) return;
   }, [id]);

   return (
      <div className="w-screen h-screen flex items-center justify-center bg-[rgb(245,245,245)]">
         <Form {...form}>
            <form
               className="h-full w-full lg:h-max lg:w-115 space-y-5 lg:border border-black/30 shadow-lg lg:rounded-xl px-8 lg:p-10 bg-white flex flex-col justify-center"
               onSubmit={form.handleSubmit(onSubmit)}>
               <div className="flex flex-col items-center gap-3 mb-10">
                  <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
                     Change Password
                  </h1>
               </div>
               <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="ml-0.5">New Password</FormLabel>
                        <FormControl>
                           <div className="w-full h-max relative">
                              <Input
                                 type={showPassword ? "text" : "password"}
                                 className="text-sm lg:text-base placeholder:text-sm lg:placeholder:text-base"
                                 placeholder="Enter new password"
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
                  className="mt-8 w-full lg:py-5 bg-blue-700 rounded-md hover:bg-blue-600 cursor-pointer disabled:opacity-50"
                  type="submit"
                  disabled={isSaving}>
                  {isSaving ? "Saving Changes" : "Save Changes"}
               </Button>
            </form>
         </Form>
      </div>
   );
}
