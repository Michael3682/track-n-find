"use client";

import { z } from "zod";
import { Item } from "@/types/types";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
   archiveItem,
   deleteItem,
   getItem,
   restoreItem,
   updateItem,
} from "@/lib/reportService";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { useAuth } from "@/contexts/auth/AuthContext";
import { uploadItemImage } from "@/lib/bucket";
import { toast } from "sonner";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { NavigationBar } from "@/components/navigationbar";

interface UpdateItemState {
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

export default function UpdateReport() {
   const { id: itemID } = useParams();
   const [open, setOpen] = useState(false);
   const [item, setItem] = useState<Item | null>(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isTrashing, setIsTrashing] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);
   const [progress, setProgress] = useState<number[]>([]);
   const { user } = useAuth();
   const router = useRouter();

   const form = useForm<UpdateItemState>({
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

   const onSubmit = async () => {
      setIsSubmitting(true);

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
         itemId: item?.id!,
         date: `${yyyy}-${mm}-${dd}`,
         attachments: urls,
      };

      const [data, err] = await updateItem(updatedData);

      if (err || !data.success) {
         setIsSubmitting(false);
         toast.error("Something wrong.");
      }

      if (data.success) {
         setIsSubmitting(false);
         toast.success("Found item has been reported.");
         setItem(data.item);
      }

      console.log(data);
   };

   const handleTrash = async () => {
      setIsTrashing(true);

      if (!item) return;

      const [data, err] = await archiveItem(item?.id);

      if (err || !data.success) {
         setIsTrashing(false);
         toast.error("Something wrong.");
      }

      if (data.success) {
         setIsTrashing(false);
         toast.success("Item has been moved to trash");
         setItem(data.item);

         router.back();
      }
   };

   const handleRestore = async () => {
      setIsTrashing(true);

      if (!item) return;

      const [data, err] = await restoreItem(item?.id);

      if (err || !data.success) {
         setIsTrashing(false);
         toast.error("Something wrong.");
      }

      if (data.success) {
         setIsTrashing(false);
         toast.success("Item has been restored");
         setItem(data.item);

         router.back();
      }
   };

   const handleDelete = async () => {
      setIsDeleting(true);

      if (!itemID) return;

      const [data, err] = await deleteItem(String(itemID));

      if (err || !data.success) {
         setIsDeleting(false);
         toast.error("Something wrong.");
      }

      if (data.success) {
         setIsDeleting(false);
         toast.success("Item has been moved to trash");
         setItem(data.item);

         router.back();
      }
   };

   useEffect(() => {
      const fetchItem = async () => {
         try {
            if (typeof itemID === "string") {
               const itemData = await getItem(itemID);
               if (itemData && itemData.length > 0 && itemData[0].success) {
                  setItem(itemData[0].item);
               }
            }
         } catch (error) {
            console.error("Error fetching item:", error);
         }
      };

      fetchItem();
   }, [itemID]);

   useEffect(() => {
      const dt = new Date(item?.date_time!);
      const date: Date = new Date(
         dt.getFullYear(),
         dt.getMonth(),
         dt.getDate()
      );
      const time: string =
         dt.getHours().toString().padStart(2, "0") +
         ":" +
         dt.getMinutes().toString().padStart(2, "0");

      if (item) {
         form.reset({
            itemName: item.name,
            date: date,
            time: time,
            location: item.location,
            description: item.description,
            attachments: [],
            userId: item.associated_person,
         });
      }
   }, [item, form]);

   return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-background overflow-x-hidden">
         <NavigationBar className="static lg:fixed" />
         <Form {...form}>
            <form
               className="lg:mt-10 w-full lg:w-125 h-full lg:h-max flex flex-col items-center justify-around lg:justify-center gap-10 lg:gap-13 lg:border lg:shadow-lg lg:rounded-xl p-8 lg:p-10 bg-secondary"
               onSubmit={form.handleSubmit(onSubmit)}>
               <h1 className="text-4xl font-extrabold tracking-tight">
                  Manage Item
               </h1>
               {!!item && (
                  <div className="space-y-4 lg:space-y-5 w-full">
                     <FormField
                        control={form.control}
                        name="itemName"
                        render={({ field }) => (
                           <FormItem className="w-full">
                              <FormLabel>Item</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder={item?.name}
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
                                    placeholder={item?.location}
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
                        name="attachments"
                        render={({ field }) => (
                           <FormItem className="w-full">
                              <FormLabel>Upload Photo</FormLabel>
                              <FormControl>
                                 <div className="flex flex-col gap-3">
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
                                    placeholder={item?.description}
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
                     <Button
                        className="w-full text-sm text-[rgb(245,245,245)] bg-blue-700 hover:bg-blue-600 cursor-pointer disabled:opacity-50"
                        type="submit"
                        disabled={isSubmitting}>
                        {isSubmitting ? "Updating" : "Update Item"}
                     </Button>
                  </div>
               )}
               <div className="w-full flex gap-2">
                  <Button
                     className="flex-1 text-sm bg-tranparent text-inherit border border-ring hover:bg-secondary cursor-pointer disabled:opacity-50"
                     type="button"
                     disabled={isTrashing}
                     onClick={() =>
                        item?.isActive ? handleTrash() : handleRestore()
                     }>
                     {isTrashing
                        ? item?.isActive
                           ? "Moving to trash"
                           : "Restoring item"
                        : item?.isActive
                        ? "Move to trash"
                        : "Restore"}
                  </Button>

                  {user?.role == "USER" && (
                     <Button
                        className="flex-1 text-sm bg-transparent border border-red-400 text-red-400 hover:bg-red-600 hover:text-white cursor-pointer disabled:opacity-50"
                        type="button"
                        disabled={isDeleting}
                        onClick={() => handleDelete()}>
                        {isDeleting ? "Deleting" : "Delete Permanently"}
                     </Button>
                  )}
               </div>
            </form>
         </Form>
      </div>
   );
}
