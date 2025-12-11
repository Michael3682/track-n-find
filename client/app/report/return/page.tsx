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
import { NavigationBar } from "@/components/navigationbar";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectLabel,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { uploadItemImage } from "@/lib/bucket";
import { getItem, reportClaim, reportReturn } from "@/lib/reportService";
import { useRouter, useSearchParams } from "next/navigation";
import { Conversation, Item } from "@/types/types";
import { getConversation } from "@/lib/chatService";

interface ClaimItemState {
   claimerName: string;
   claimerCredentials: {
      yearAndSection?: string;
      course?: string;
      studentId?: string;
      contactNumber?: string;
      proofofClaim: File[];
   };
}

const formSchema = z.object({
   claimerName: z.string(),
   claimerCredentials: z.object({
      yearAndSection: z.string().optional(),
      studentId: z.string().optional(),
      contactNumber: z.string().optional(),
      proofofClaim: z.array(z.file()),
   }),
});

export default function ClaimItem() {
   const [open, setOpen] = useState(false);
    const [progress, setProgress] = useState<number[]>([]);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const { user } = useAuth();
   const convoId = useSearchParams().get("conversationId")
   const [convo, setConvo] = useState<Conversation | null>(null)
   const router = useRouter()

   const form = useForm<ClaimItemState>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         claimerName: "",
         claimerCredentials: {
            yearAndSection: "",
            studentId: "",
            contactNumber: "",
            proofofClaim: [],
         }
      },
   });

   const onSubmit = async () => {
      if(!convo) return

      setIsSubmitting(true);
      const formValues = form.getValues();

      const files = formValues.claimerCredentials.proofofClaim;

      let urls: string[] = []
      if (files && files.length > 0 && user) {
         urls = await uploadItemImage(files, user, setProgress);
      }

      const [data, err] = await reportReturn({
         itemId: convo.item.id,
         returnerId: convo.senderId,
         returnerName: formValues.claimerName,
         claimerCredentials: {
            yearAndSection: ` ${formValues.claimerCredentials.course} ${formValues.claimerCredentials.yearAndSection}`,
            studentId: formValues.claimerCredentials.studentId!,
            contactNumber: formValues.claimerCredentials.contactNumber!,
            proofOfClaim: urls.length > 0 ? urls[0] : ""
         },
         reporterId: convo.hostId,
         conversationId: convo.id
      });

      if (err || !data.success) {
         setIsSubmitting(false);
         toast.error("Something wrong.");
      }

      if (data.success) {
         setIsSubmitting(false);
         toast.success("Found item has been reported.");

         form.reset({
            claimerName: "",
            claimerCredentials: {
               yearAndSection: "",
               studentId: "",
               contactNumber: "",
               proofofClaim: []
            }
         });

         router.push('/messages')
      }
   };

   const yearSections = Array.from({ length: 4 }, (_, i) => {
      const year = i + 1;
      return ["A", "B", "C", "D"].map((section) => `${year}${section}`);
   }).flat();

   useEffect(() => {
      getConversation(convoId!).then(([data]) => {
         setConvo(data.conversation)
      })
   }, [])

   useEffect(() => {
      if(!convo) return

      form.reset({
         claimerName: convo.sender.name,
         claimerCredentials: {
            yearAndSection: "",
            studentId: convo.senderId,
            contactNumber: "",
            proofofClaim: []
         }
      })
   }, [convo, form])

   console.log(convo)

   return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-background overflow-x-hidden">
         <NavigationBar className="static lg:fixed" />
         <Form {...form}>
            <form
               className="lg:mt-10 w-full lg:w-max h-full lg:h-max flex flex-col items-center justify-around lg:justify-center gap-10 lg:gap-13 lg:border lg:shadow-lg lg:rounded-xl p-8 lg:p-10 bg-secondary"
               onSubmit={form.handleSubmit(onSubmit)}>
               <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
                  Return Item Confirmation
               </h1>
               <div className="space-y-6 w-full">
                  <FormField
                     control={form.control}
                     name="claimerName"
                     render={({ field }) => (
                        <FormItem className="w-full">
                           <FormLabel>Name</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Enter claimer's name"
                                 className="placeholder:text-xs lg:placeholder:text-sm text-xs lg:text-sm bg-background"
                                 {...field}
                                 onChange={(e) =>
                                    field.onChange(e.target.value)
                                 }
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <div className="flex gap-5 w-full">
                     <FormField
                        control={form.control}
                        name="claimerCredentials.yearAndSection"
                        render={({ field }) => (
                           <FormItem className="w-full">
                              <FormLabel>Year & Section</FormLabel>
                              <FormControl>
                                 <Select
                                    onValueChange={field.onChange}
                                    value={field.value}>
                                    <SelectTrigger className="w-full bg-background">
                                       <SelectValue placeholder="Select Yr & Sec" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectGroup>
                                          <SelectLabel>
                                             Year and Section
                                          </SelectLabel>
                                          {yearSections.map((ys) => (
                                             <SelectItem key={ys} value={ys}>
                                                {ys}
                                             </SelectItem>
                                          ))}
                                       </SelectGroup>
                                    </SelectContent>
                                 </Select>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="claimerCredentials.course"
                        render={({ field }) => (
                           <FormItem className="w-full">
                              <FormLabel>Course</FormLabel>
                              <FormControl>
                                 <Select
                                    onValueChange={field.onChange}
                                    value={field.value}>
                                    <SelectTrigger className="w-full bg-background">
                                       <SelectValue placeholder="Select course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectGroup>
                                          <SelectLabel>Course</SelectLabel>
                                          <SelectItem value="BEED">
                                             BEED
                                          </SelectItem>
                                          <SelectItem value="BSED">
                                             BSED
                                          </SelectItem>
                                          <SelectItem value="BSHM">
                                             BSHM
                                          </SelectItem>
                                          <SelectItem value="BSIT">
                                             BSIT
                                          </SelectItem>
                                       </SelectGroup>
                                    </SelectContent>
                                 </Select>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
                  <FormField
                     control={form.control}
                     name="claimerCredentials.studentId"
                     render={({ field }) => (
                        <FormItem className="w-full">
                           <FormLabel>Student ID</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Enter student id"
                                 className="placeholder:text-xs lg:placeholder:text-sm text-xs lg:text-sm bg-background"
                                 {...field}
                                 onChange={(e) =>
                                    field.onChange(e.target.value)
                                 }
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="claimerCredentials.contactNumber"
                     render={({ field }) => (
                        <FormItem className="w-full">
                           <FormLabel>Contact</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Enter contact number"
                                 className="placeholder:text-xs lg:placeholder:text-sm text-xs lg:text-sm bg-background"
                                 {...field}
                                 onChange={(e) =>
                                    field.onChange(e.target.value)
                                 }
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="claimerCredentials.proofofClaim"
                     render={({ field }) => (
                        <FormItem className="w-full">
                           <FormLabel>Proof of claim</FormLabel>
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
