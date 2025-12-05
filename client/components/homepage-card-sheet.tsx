"use client";

import Link from "next/link";
import { Item } from "@/types/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getItems } from "@/lib/reportService";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth/AuthContext";
import { findOrCreateConversation } from "@/lib/chatService";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    CarouselApi,
} from "@/components/ui/carousel"

export function HomepageCardSheet() {
    const isMobile = useIsMobile();
    const router = useRouter();
    const { user } = useAuth()
    const [items, setItems] = useState<Item[]>([]);
    const [foundApi, setFoundApi] = useState<CarouselApi>();
    const [lostApi, setLostApi] = useState<CarouselApi>();
    const [foundCurrent, setFoundCurrent] = useState(0);
    const [lostCurrent, setLostCurrent] = useState(0);

    const foundItems = items
        .filter((item) => item.type.toLowerCase() === "found")
        .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())
        .slice(0, 10);

    const lostItems = items
        .filter((item) => item.type.toLowerCase() === "lost")
        .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())
        .slice(0, 10);

    const formattedDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const handleMessageUser = async (item: Item) => {
        const [data] = await findOrCreateConversation({ itemId: item.id, hostId: item.author.id })

        router.push(`/messages/${data.conversation.id}`)
    }

    useEffect(() => {
        getItems().then(([data]) => setItems(data.items));

        if (foundApi) {
            setFoundCurrent(foundApi.selectedScrollSnap());
            foundApi.on("select", () => {
                setFoundCurrent(foundApi.selectedScrollSnap());
            });
        }

        if (lostApi) {
            setLostCurrent(lostApi.selectedScrollSnap());
            lostApi.on("select", () => {
                setLostCurrent(lostApi.selectedScrollSnap());
            });
        }
    }, [foundApi, lostApi]);

    return (
        <div className="w-full h-full px-8 lg:px-32 py-15 lg:py-30 flex flex-col gap-15 lg:gap-20">
            <div className="flex flex-col gap-8">
                <h1 className="text-2xl lg:text-4xl font-semibold text-primary tracking-tight">
                    Recent Found Items
                </h1>
                <Carousel className="w-full overflow-visible" opts={{ loop: isMobile }} setApi={setFoundApi}>
                    <CarouselContent className="-ml-5">
                        {foundItems.map((item) => (
                            <CarouselItem key={item.id} className="pl-5 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/5">
                                <Sheet>
                                    <SheetTrigger className="cursor-pointer p-0" asChild>
                                        <Card className="w-full flex gap-0 bg-transparent overflow-hidden border rounded-sm hover:border-black/25 transition-all duration-100 ease-linear">
                                            <CardHeader className="bg-primary-foreground p-0 gap-0 relative">
                                                <CardTitle>
                                                    <img
                                                        className="aspect-video lg:h-50 object-cover object-center z-10"
                                                        src={
                                                            item?.attachments?.length > 0
                                                                ? item.attachments[0]
                                                                : undefined
                                                        }
                                                        alt="image"
                                                    />
                                                    <Badge
                                                        className={`${item.status === "CLAIMED"
                                                            ? "bg-green-400"
                                                            : "bg-red-400"
                                                            } z-20 absolute top-0 right-0 rounded-tl-none rounded-tr-none rounded-bl-md rounded-br-none`}>
                                                        <small>{item.status}</small>
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardDescription className="p-4 text-medium font-medium lg:text-base text-primary flex flex-col">
                                                {item.name}
                                            </CardDescription>
                                        </Card>
                                    </SheetTrigger>
                                    <SheetContent className="p-8 lg:p-12" side="center">
                                        <SheetHeader className="p-0 space-y-3 lg:space-y-5">
                                            <img
                                                className="aspect-video object-contain object-top shadow-inner shadow-black/10 rounded-md p-5 drop-shadow-lg drop-shadow-black/50"
                                                src={
                                                    item?.attachments?.length > 0
                                                        ? item.attachments[0]
                                                        : undefined
                                                }
                                                alt="image"
                                            />
                                            <div className="space-y-7">
                                                <SheetTitle className="text-xl lg:text-3xl">
                                                    {item.name}
                                                    <p className="text-xs font-light text-muted-foreground">
                                                        Reported By:{" "}
                                                        <span className="font-normal">
                                                            {item.author.name}
                                                        </span>
                                                    </p>
                                                </SheetTitle>
                                                <div className="space-y-7">
                                                    <p className="text-base lg:text-lg text-muted-foreground">
                                                        {item.description}
                                                    </p>
                                                    <div className="space-y-2">
                                                        <Separator />
                                                        <p className="text-xs lg:text-base font-medium text-primary flex justify-between">
                                                            Reported on:{" "}
                                                            <span className="font-normal">
                                                                {formattedDate(item.date_time)}
                                                            </span>
                                                        </p>
                                                        <p className="text-xs lg:text-base font-medium text-primary flex justify-between">
                                                            Location:{" "}
                                                            <span className="font-normal">
                                                                {item.location}
                                                            </span>
                                                        </p>
                                                        <p className="text-xs lg:text-base font-medium text-primary flex justify-between">
                                                            Status:{" "}
                                                            <span className="font-semibold text-red-500">
                                                                {item.status}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </SheetHeader>
                                        <SheetFooter className="px-0">
                                            <Button
                                                className="text-xs lg:text-base py-0 lg:py-5 cursor-pointer"
                                                type="submit"
                                                asChild>
                                                {
                                                    item.associated_person == user?.id ?
                                                        <Link href={`update/${item.id}`}>
                                                            Manage Item
                                                        </Link>
                                                        :
                                                        <p onClick={() => handleMessageUser(item)}>
                                                            Message User
                                                        </p>
                                                }
                                            </Button>
                                        </SheetFooter>
                                    </SheetContent>
                                </Sheet>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex" />
                </Carousel>
                {isMobile && (
                    <div className="flex justify-center gap-2 mt-4">
                        {foundItems.map((_, index) => (
                            <Button
                                key={index}
                                size="icon"
                                className={`h-2 rounded-full transition-all ${index === foundCurrent
                                    ? "w-10 bg-primary"
                                    : "w-5 bg-primary/30"
                                    }`}
                                onClick={() => foundApi?.scrollTo(index)}
                            />
                        ))}
                    </div>
                )}
            </div>
            <Separator />
            <div className="flex flex-col gap-8">
                <h1 className="text-2xl lg:text-4xl font-semibold text-primary tracking-tight">
                    Recent Lost Items
                </h1>
                <Carousel className="w-full" opts={{ loop: isMobile }} setApi={setLostApi}>
                    <CarouselContent className="-ml-5">
                        {lostItems.map((item) => (
                            <CarouselItem key={item.id} className="pl-5 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/5">
                                <Sheet>
                                    <SheetTrigger className="cursor-pointer p-0" asChild>
                                        <Card className="w-full flex gap-0 bg-transparent overflow-hidden border rounded-sm hover:border-black/25 transition-all duration-100 ease-linear">
                                            <CardHeader className="bg-primary-foreground p-0 gap-0 relative">
                                                <CardTitle>
                                                    <img
                                                        className="aspect-video lg:h-50 object-cover object-center z-10"
                                                        src={
                                                            item?.attachments?.length > 0
                                                                ? item.attachments[0]
                                                                : undefined
                                                        }
                                                        alt="image"
                                                    />
                                                    <Badge
                                                        className={`${item.status === "CLAIMED"
                                                            ? "bg-green-400"
                                                            : "bg-red-400"
                                                            } z-20 absolute top-0 right-0 rounded-tl-none rounded-tr-none rounded-bl-md rounded-br-none`}>
                                                        <small>{item.status}</small>
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardDescription className="p-4 text-medium font-medium lg:text-base text-primary flex flex-col">
                                                {item.name}
                                            </CardDescription>
                                        </Card>
                                    </SheetTrigger>
                                    <SheetContent className="p-8 lg:p-12" side="center">
                                        <SheetHeader className="p-0 space-y-3 lg:space-y-5">
                                            <img
                                                className="aspect-video object-contain object-top shadow-inner shadow-black/10 rounded-md p-5 drop-shadow-lg drop-shadow-black/50"
                                                src={
                                                    item?.attachments?.length > 0
                                                        ? item.attachments[0]
                                                        : undefined
                                                }
                                                alt="image"
                                            />
                                            <div className="space-y-7">
                                                <SheetTitle className="text-xl lg:text-3xl">
                                                    {item.name}
                                                    <p className="text-xs font-light text-muted-foreground">
                                                        Reported By:{" "}
                                                        <span className="font-normal">
                                                            {item.author.name}
                                                        </span>
                                                    </p>
                                                </SheetTitle>
                                                <div className="space-y-7">
                                                    <p className="text-base lg:text-lg text-muted-foreground">
                                                        {item.description}
                                                    </p>
                                                    <div className="space-y-2">
                                                        <Separator />
                                                        <p className="text-xs lg:text-base font-medium text-primary flex justify-between">
                                                            Reported on:{" "}
                                                            <span className="font-normal">
                                                                {formattedDate(item.date_time)}
                                                            </span>
                                                        </p>
                                                        <p className="text-xs lg:text-base font-medium text-primary flex justify-between">
                                                            Location:{" "}
                                                            <span className="font-normal">
                                                                {item.location}
                                                            </span>
                                                        </p>
                                                        <p className="text-xs lg:text-base font-medium text-primary flex justify-between">
                                                            Status:{" "}
                                                            <span className="font-semibold text-red-500">
                                                                {item.status}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </SheetHeader>
                                        <SheetFooter className="px-0">
                                            <Button
                                                className="text-xs lg:text-base py-0 lg:py-5 cursor-pointer"
                                                type="submit"
                                                asChild>
                                                {
                                                    item.associated_person == user?.id ?
                                                        <Link href={`update/${item.id}`}>
                                                            Manage Item
                                                        </Link>
                                                        :
                                                        <p onClick={() => handleMessageUser(item)}>
                                                            Message User
                                                        </p>
                                                }
                                            </Button>
                                        </SheetFooter>
                                    </SheetContent>
                                </Sheet>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex" />
                </Carousel>
                {isMobile && (
                    <div className="flex justify-center gap-2 mt-4">
                        {lostItems.map((_, index) => (
                            <Button
                                key={index}
                                size="icon"
                                className={`h-2 rounded-full transition-all ${index === lostCurrent
                                    ? "w-10 bg-primary"
                                    : "w-5 bg-primary/30"
                                    }`}
                                onClick={() => lostApi?.scrollTo(index)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}