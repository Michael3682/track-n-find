"use client";

import { file, z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reportFound } from "@/lib/reportService";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { uploadItemImage } from "@/lib/bucket";
import { useAuth } from "@/contexts/auth/AuthContext";

interface ReportFoundItemState {
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
      message: "You must enter the name of the item that you found.",
   }),
   date: z.date(),
   time: z.string(),
   location: z.string(),
   description: z.string(),
   attachments: z.array(z.file()).optional(),
   userId: z.string(),
});

export default function ReportLost() {
   const [open, setOpen] = useState(false);
   const [progress, setProgress] = useState<number[]>([])
   const { user } = useAuth()

   const form = useForm<ReportFoundItemState>({
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
      const formValues = form.getValues();

      const yyyy = formValues.date.getFullYear();
      const mm = String(formValues.date.getMonth() + 1).padStart(2, "0");
      const dd = String(formValues.date.getDate()).padStart(2, "0");

      const files = formValues.attachments

      let urls;
      if(files && files.length > 0 && user) {
         urls = await uploadItemImage(files, user, setProgress)
      }

      const updatedData = {
         ...formValues,
         date: `${yyyy}-${mm}-${dd}`,
         attachments: urls
      };

      const [data, err] = await reportFound(updatedData);

      console.log(data);
   };
   return (
      <div className="w-screen h-screen flex justify-center bg-[rgb(245,245,245)] overflow-x-hidden">
         <NavigationBar />
         <Form {...form}>
            <form
               className="w-125 h-max flex flex-col items-center justify-center gap-5 border border-black/30 shadow-lg rounded-xl p-10 mt-30 bg-white"
               onSubmit={form.handleSubmit(onSubmit)}>
               <h1 className="text-4xl font-extrabold tracking-tight mb-10">
                  Report Found Item
               </h1>
               <div className="space-y-5 w-full">
                  <FormField
                     control={form.control}
                     name="itemName"
                     render={({ field }) => (
                        <FormItem className="w-full">
                           <FormLabel>Item</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Enter item name"
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
                                                className="w-full justify-between font-normal">
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
                                       className="w-full bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
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
                           <FormLabel>Location Found</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Ex. Alegria, Cordova, Cebu"
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
                                 placeholder="Ex. Found a black wallet. It’s a worn bi-fold with a small scratch. Contains Westlake University student ID, a few bank cards, some cash, and a small photo of a dog."
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
                  className="w-full mt-10 bg-blue-600 hover:bg-blue-700"
                  type="submit">
                  Submit Report
               </Button>
            </form>
         </Form>
      </div>
   );
}
