"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDownIcon } from "lucide-react";
import { uploadItemImage } from "@/lib/bucket";
import { Button } from "@/components/ui/button";
import { reportLost } from "@/lib/reportService";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/auth/AuthContext";
import { NavigationBar } from "@/components/navigationbar";
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

interface ReportLostItemState {
   itemName: string;
   date: Date;
   time: string;
   location: string;
   description: string;
   attachments?: File[];
   userId: string;
}

const formSchema = z.object({
   itemName: z.string().min(1, {
      message: "You must enter the name of the item that you lost.",
   }),
   date: z.date(),
   time: z.string(),
   location: z.string(),
   description: z.string().min(1, {
      message: "Required",
   }),
   attachments: z.array(z.file()).optional(),
   userId: z.string(),
});

export default function ReportLost() {
   const [open, setOpen] = useState(false);
   const [progress, setProgress] = useState<number[]>([]);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const { user } = useAuth();

   const form = useForm<ReportLostItemState>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         itemName: "",
         date: new Date(),
         time: "",
         location: "",
         description: "",
         attachments: [],
         userId: "",
      },
   });

   console.log(form)

   const updateDateTime = (date?: Date) => {
      if (!date) return;

      const updated = new Date(date);

      form.setValue("date", updated);
   };

   const convertFileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.onload = () => resolve(reader.result as string);
         reader.onerror = reject;
         reader.readAsDataURL(file);
      });
   };

   const onSubmit = async () => {
      setIsSubmitting(true)
      const formValues = form.getValues();

      const yyyy = formValues.date.getFullYear();
      const mm = String(formValues.date.getMonth() + 1).padStart(2, "0");
      const dd = String(formValues.date.getDate()).padStart(2, "0");

      const files = formValues.attachments;

      let urls;
      if (files && files.length > 0 && user) {
         urls = await uploadItemImage(files, user, setProgress);
      }

      const updatedData = {
         ...formValues,
         date: `${yyyy}-${mm}-${dd}`,
         attachments: urls,
      };

      const [data, err] = await reportLost(updatedData);

      if (err || !data.success) {
         setIsSubmitting(false);
         toast.error("Something wrong.");
      }

      if (data.success) {
         setIsSubmitting(false);
         toast.success("Lost item has been reported.");

         form.reset({
            itemName: "",
            date: new Date(),
            time: "",
            location: "",
            description: "",
            attachments: [],
            userId: "",
         });
      }

      console.log(data);
   };
   return (
      <div className="w-screen h-full lg:h-screen flex flex-col items-center justify-center bg-secondary overflow-x-hidden">
         <NavigationBar className="static lg:fixed"/>
         <Form {...form}>
            <form
               className="w-full lg:w-125 h-full lg:h-max flex flex-col items-center justify-center gap-10 lg:gap-13 lg:border border-black/30 lg:shadow-lg lg:rounded-xl p-8 py-5 lg:p-10 bg-white"
               onSubmit={form.handleSubmit(onSubmit)}>
               <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight">
                  Report Lost Item
               </h1>
               <div className="space-y-4 lg:space-y-5 w-full">
                  <FormField
                     control={form.control}
                     name="itemName"
                     render={({ field }) => (
                        <FormItem className="w-full">
                           <FormLabel>Item</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Enter item name"
                                 className="placeholder:text-xs lg:placeholder:text-sm text-xs lg:text-sm"
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
                  <div className="flex gap-5">
                     <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                           <FormItem className="w-full">
                              <FormControl>
                                 <div className="w-full flex gap-4">
                                    <div className="w-full flex flex-col gap-3">
                                       <Label
                                          htmlFor="date-picker"
                                          className="px-1">
                                          Date
                                       </Label>
                                       <Popover
                                          open={open}
                                          onOpenChange={setOpen}>
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
                                 </div>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                           <FormItem className="w-max ">
                              <FormControl>
                                 <div className="flex flex-col gap-3">
                                    <Label
                                       htmlFor="time-picker"
                                       className="px-1">
                                       Time
                                    </Label>
                                    <Input
                                       type="time"
                                       id="time-picker"
                                       {...field}
                                       onChange={(e) => {
                                          field.onChange(e.target.value);
                                       }}
                                       className="w-full bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none placeholder:text-xs lg:placeholder:text-sm text-xs lg:text-sm"
                                    />
                                 </div>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
                  <FormField
                     control={form.control}
                     name="location"
                     render={({ field }) => (
                        <FormItem className="w-full">
                           <FormLabel>Location Lost</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Ex. Alegria, Cordova, Cebu"
                                 className="placeholder:text-xs lg:placeholder:text-sm text-xs lg:text-sm"
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
                     name="attachments"
                     render={({ field }) => (
                        <FormItem className="w-full">
                           <FormLabel>Upload Photo</FormLabel>
                           <FormControl>
                              <div className="flex flex-col gap-3">
                                 <Input
                                    type="file"
                                    accept="image/*"
                                    className="placeholder:text-xs lg:placeholder:text-sm text-xs lg:text-sm"
                                    onChange={async (e) => {
                                       const file = e.target.files?.[0];
                                       if (!file) return;

                                       // const base64 = await convertFileToBase64(
                                       //    file
                                       // );

                                       field.onChange([file]);
                                    }}
                                 />
                              </div>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="description"
                     render={({ field }) => (
                        <FormItem className="w-full">
                           <FormLabel>Description</FormLabel>
                           <FormControl>
                              <Textarea
                                 placeholder="Ex. I lost a black wallet. It’s a worn bi-fold with a small scratch. Contains Westlake University student ID, a few bank cards, some cash, and a small photo of a dog."
                                 className="placeholder:text-xs lg:placeholder:text-sm text-xs lg:text-sm"
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
               </div>
               <Button
                  className="w-full text-sm bg-blue-700 hover:bg-blue-600 cursor-pointer disabled:opacity-50"
                  type="submit"
                  disabled={isSubmitting}>
                  {isSubmitting ? "Submitting Report" : "Submit Report"}
               </Button>
            </form>
         </Form>
      </div>
   );
}
