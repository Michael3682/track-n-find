"use client"

import { z } from "zod"
import { Item } from "@/types/types"
import { useForm } from "react-hook-form"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getItem } from "@/lib/reportService"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

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
    const { id: itemID } = useParams()
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState<Item | null>(null)

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

    const onSubmit = () => {
        console.log("Item Updated")
    }

    useEffect(() => {
        const fetchItem = async () => {
            try {
                if (typeof itemID === 'string') {
                    const itemData = await getItem(itemID)
                    if (itemData && itemData.length > 0 && itemData[0].success) {
                        setItem(itemData[0].item)
                    }
                }
            } catch (error) {
                console.error("Error fetching item:", error)
            }
        }

        fetchItem()
    }, [itemID])

    return (
        <div className="w-screen h-full lg:h-screen flex flex-col items-center justify-center bg-secondary overflow-x-hidden">
            <Form {...form}>
                <form className="lg:mt-10 w-full lg:w-125 h-full lg:h-max flex flex-col items-center justify-center gap-10 lg:gap-13 lg:border border-black/30 lg:shadow-lg lg:rounded-xl p-8 py-5 lg:p-10 bg-white" onSubmit={form.handleSubmit(onSubmit)}>
                    <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight">Update Item</h1>
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
                                            placeholder={item?.location}
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
                </form>
            </Form>
        </div>
    )
}