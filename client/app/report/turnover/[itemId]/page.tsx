"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/contexts/auth/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";

import { uploadItemImage } from "@/lib/bucket";
import { confirmTurnover, reportReturn } from "@/lib/reportService";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Conversation, Item } from "@/types/types";
import { NavigationBar } from "@/components/navigationbar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface ClaimItemState {
  proofOfTurnover: File[];
}

const formSchema = z.object({
  proofOfTurnover: z.array(z.file()),
});

export default function ClaimItem() {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [progress, setProgress] = useState<number[]>([])
   const { user } = useAuth();
   const { itemId } = useParams()
   const router = useRouter()

   const form = useForm<ClaimItemState>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        proofOfTurnover: [],
      },
   });

   const onSubmit = async () => {
      setIsSubmitting(true);
      const formValues = form.getValues();

      const files = formValues.proofOfTurnover;

      let urls: string[] = []
      if (files && files.length > 0 && user) {
         urls = await uploadItemImage(files, user, setProgress);
      }

      const [data, err] = await confirmTurnover(
        itemId as string,
        urls.length > 0 ? urls[0] : ""
      );

      if (err || !data.success) {
         setIsSubmitting(false);
         toast.error("Something wrong.");
      }

      if (data.success) {
         setIsSubmitting(false);
         toast.success("Item turnover is confirmed");

         form.reset({
            proofOfTurnover: []
         });

         router.push('/messages')
      }
   };

   return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-background overflow-x-hidden">
         <NavigationBar className="static lg:fixed" />
         <Form {...form}>
            <form
               className="lg:mt-10 w-full lg:w-max h-full lg:h-max flex flex-col items-center justify-around lg:justify-center gap-10 lg:gap-13 lg:border lg:shadow-lg lg:rounded-xl p-8 lg:p-10 bg-secondary"
               onSubmit={form.handleSubmit(onSubmit)}>
               <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
                  Turnover Item Confirmation
               </h1>
               <div className="space-y-6 w-full">
                  <FormField
                     control={form.control}
                     name="proofOfTurnover"
                     render={({ field }) => (
                        <FormItem className="w-full">
                           <FormLabel>Proof of turnover</FormLabel>
                           <FormControl>
                              <Input
                                 type="file"
                                 accept="image/*"
                                 className="placeholder:text-xs lg:placeholder:text-sm text-xs lg:text-sm bg-background"
                                 onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    field.onChange([file]);
                                 }}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />        
               </div>
               <Button
                  className="w-full text-sm text-[rgb(229,229,229)] bg-blue-700 hover:bg-blue-600 cursor-pointer disabled:opacity-50"
                  type="submit"
                  disabled={isSubmitting}>
                  {isSubmitting ? "Submitting Report" : "Submit Report"}
               </Button>
            </form>
         </Form>
      </div>
   );
}
