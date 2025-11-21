"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
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

interface ReportFoundItemState {
   item: string;
   description: string;
   dateFound: Date;
   locationFound: string;
   photo: File | null;
}

const formSchema = z.object({
   item: z
      .string()
      .min(1, {
         message: "You must enter the name of the item that you found.",
      }),
   description: z.string(),
   dateFound: z.date(),
   locationFound: z.string(),
   photo: z
      .any()
      .nullable()
      .refine((file) => !file || file instanceof File, {
         message: "Must be a file",
      }),
});

export default function ReportLost() {
   const [open, setOpen] = useState(false);
   const [time, setTime] = useState("");

   const form = useForm<ReportFoundItemState>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         item: "",
         description: "",
         dateFound: new Date(),
         locationFound: "",
         photo: null,
      },
   });

   const updateDateTime = (date?: Date, timeStr?: string) => {
      if (!date || !timeStr) return;

      const [h, m, s] = timeStr.split(":").map(Number);

      const updated = new Date(date);

      updated.setHours(h || 0);
      updated.setMinutes(m || 0);
      updated.setSeconds(s || 0);

      form.setValue("dateFound", updated);
   };

   const onSubmit = (data: ReportFoundItemState) => {
      console.log("RAW Date object:", data.dateFound);
      console.log(
         "Readable date:",
         data.dateFound.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
         })
      );
      console.log("Full form:", data);
   };
   return (
      <div className="w-screen h-screen flex items-center justify-center bg-[rgb(245,245,245)]">
         <Form {...form}>
            <form
               className="w-125 h-max flex flex-col items-center justify-center gap-5 border border-black/30 shadow-lg rounded-xl p-10 bg-white"
               onSubmit={form.handleSubmit(onSubmit)}>
               <h1 className="text-4xl font-extrabold tracking-tight mb-10">
                  Report Found Item
               </h1>
               <div className="space-y-5">
                  <FormField
                     control={form.control}
                     name="item"
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
                  <FormField
                     control={form.control}
                     name="dateFound"
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
                                    <Popover open={open} onOpenChange={setOpen}>
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
                                                        month: "long",
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
                                                updateDateTime(date, time);
                                                setOpen(false);
                                             }}
                                          />
                                       </PopoverContent>
                                    </Popover>
                                 </div>
                                 <div className="flex flex-col gap-3">
                                    <Label
                                       htmlFor="time-picker"
                                       className="px-1">
                                       Time
                                    </Label>
                                    <Input
                                       type="time"
                                       id="time-picker"
                                       step="1"
                                       defaultValue={time}
                                       onChange={(e) => {
                                          setTime(e.target.value);
                                          updateDateTime(
                                             field.value,
                                             e.target.value
                                          );
                                       }}
                                       className="w-full bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                    />
                                 </div>
                              </div>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="locationFound"
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
                     name="photo"
                     render={({ field }) => (
                        <FormItem className="w-full">
                           <FormLabel>Upload Photo</FormLabel>
                           <FormControl>
                              <div className="flex flex-col gap-3">
                                 <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                       const file = e.target.files?.[0];
                                       field.onChange(file);
                                    }}
                                 />
                                 {field.value && (
                                    <img
                                       src={URL.createObjectURL(field.value)}
                                       alt="Preview"
                                       className="h-32 w-32 object-cover rounded-md border"
                                    />
                                 )}
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
