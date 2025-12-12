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
import CardSheet from "./card-sheet";

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

    const formattedDate = (date: string | number | Date) => {
       if (!date) return;
       return new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
       });
    };

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
        <div className="w-full h-full px-8 lg:px-32 py-15 lg:py-30 flex flex-col gap-15 lg:gap-20 bg-sidebar">
            <div className="flex flex-col gap-8">
                <h1 className="text-2xl lg:text-4xl font-semibold text-primary tracking-tight">
                    Recent Found Items
                </h1>
                <Carousel className="w-full overflow-visible" opts={{ loop: isMobile }} setApi={setFoundApi}>
                    <CarouselContent className="-ml-5">
                        {foundItems.map((item) => (
                            <CarouselItem key={item.id} className="pl-5 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/5">
                                <CardSheet item={item}/>
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
                                <CardSheet item={item}/>
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