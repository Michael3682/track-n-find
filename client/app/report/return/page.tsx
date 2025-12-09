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
import { getItem, reportClaim } from "@/lib/reportService";
import { useSearchParams } from "next/navigation";
import { Conversation, Item } from "@/types/types";

interface ClaimItemState {
   claimerName: string;
   claimerCredentials: {
      yearAndSection?: string;
      studentId?: string;
      contactNumber?: string;
      proofofClaim: File[];
   };
   claimedAt: Date;
}

const formSchema = z.object({
   claimerName: z.string(),
   claimerCredentials: z.object({
      yearAndSection: z.string().optional(),
      studentId: z.string().optional(),
      contactNumber: z.string().optional(),
      proofofClaim: z.array(z.file()),
   }),
   claimedAt: z.date(),
});

export default function ClaimItem() {
   const [open, setOpen] = useState(false);
    const [progress, setProgress] = useState<number[]>([]);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const { user } = useAuth();
   const itemId = useSearchParams().get("itemId")
   const [item, setItem] = useState<Item | null>(null)

   const form = useForm<ClaimItemState>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         claimerName: "",
         claimerCredentials: {
            yearAndSection: "",
            studentId: "",
            contactNumber: "",
            proofofClaim: [],
         },
         claimedAt: new Date(),
      },
   });

   const updateDateTime = (date?: Date) => {
      if (!date) return;

      const updated = new Date(date);

      form.setValue("claimedAt", updated);
   };

   const onSubmit = async () => {
      setIsSubmitting(true);
      const formValues = form.getValues();

      const yyyy = formValues.claimedAt.getFullYear();
      const mm = String(formValues.claimedAt.getMonth() + 1).padStart(2, "0");
      const dd = String(formValues.claimedAt.getDate()).padStart(2, "0");

      const files = formValues.claimerCredentials.proofofClaim;

      let urls;
      if (files && files.length > 0 && user) {
         urls = await uploadItemImage(files, user, setProgress);
      }

      const updatedData = {
         ...formValues,
         date: `${yyyy}-${mm}-${dd}`,
         attachments: urls,
      };

      // const [data, err] = await reportClaim({
      //    itemId, claimerId
      // });

      // if (err || !data.success) {
      //    setIsSubmitting(false);
      //    toast.error("Something wrong.");
      // }

      // if (data.success) {
      //    setIsSubmitting(false);
      //    toast.success("Found item has been reported.");

      //    form.reset({
      //       claimerName: "",
      //       claimerCredentials: {
      //          yearAndSection: "",
      //          studentId: "",
      //          contactNumber: "",
      //          proofofClaim: []
      //       },
      //       claimedAt: new Date()
      //    });
      // }
   };

   const yearSections = Array.from({ length: 4 }, (_, i) => {
      const year = i + 1;
      return ["A", "B", "C", "D"].map((section) => `${year}${section}`);
   }).flat();

   useEffect(() => {
      getItem(itemId!).then(([data]) => {
         setItem({...data.item, conversations: data.item.conversations?.filter((convo: Conversation) => convo.itemId == itemId)})
      })
   }, [])

   console.log(item)
   return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-background overflow-x-hidden">
         <NavigationBar className="static lg:fixed" />
         <Form {...form}>
            <form
               className="lg:mt-10 w-full lg:w-max h-full lg:h-max flex flex-col items-center justify-around lg:justify-center gap-10 lg:gap-13 lg:border lg:shadow-lg lg:rounded-xl p-8 lg:p-10 bg-secondary"
               onSubmit={form.handleSubmit(onSubmit)}>
               <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
                  Claim Item Confirmation
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
                                 placeholder="Enter your name"
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
                        name="claimerCredentials.yearAndSection"
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
                  <FormField
                     control={form.control}
                     name="claimedAt"
                     render={({ field }) => (
                        <FormItem className="w-full">
                           <FormLabel>Claimed At</FormLabel>
                           <FormControl>
                              <div className="w-full flex flex-col gap-3">
                                 <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                       <Button
                                          variant="outline"
                                          id="date-picker"
                                          className="w-full justify-between font-normal placeholder:text-xs lg:placeholder:text-sm text-xs lg:text-sm">
                                          {field.value
                                             ? field.value.toLocaleDateString(
                                                  "en-US",
                                                  {
                                                     year: "numeric",
                                                     month: "short",
                                                     day: "numeric",
                                                  }
                                               )
                                             : "Select date"}
                                          <ChevronDownIcon />
                                       </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                       className="w-auto overflow-hidden p-0"
                                       align="start">
                                       <Calendar
                                          mode="single"
                                          selected={field.value}
                                          captionLayout="dropdown"
                                          onSelect={(date) => {
                                             if (!date) return;
                                             updateDateTime(date);
                                             setOpen(false);
                                          }}
                                       />
                                    </PopoverContent>
                                 </Popover>
                              </div>
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
