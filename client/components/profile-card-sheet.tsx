"use client"

import Link from "next/link";
import { Item } from "@/types/types";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconFolderCode } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { getUserFoundItems, getUserLostItems } from "@/lib/reportService";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
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
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";

export function FoundItemsCardSheet() {
    const [items, setItems] = useState<{
        lostItems: Item[];
        foundItems: Item[];
    }>({
        lostItems: [],
        foundItems: [],
    });
    const formattedDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    useEffect(() => {
        const getUsers = async () =>
            await Promise.all([getUserFoundItems(), getUserLostItems()]);
        const fetchUsers = async () => {
            const [[found], [lost]] = await getUsers();

            setItems({ foundItems: found.foundItems, lostItems: lost.lostItems });
        };

        fetchUsers();
    }, []);
    return (
        <>
            {items.foundItems.length > 0 ? (
                items.foundItems.map((item) => (
                    <Sheet key={item.id}>
                        <SheetTrigger className="cursor-pointer p-0" asChild>
                            <Card className="w-26 lg:w-50 flex gap-0 bg-transparent overflow-hidden border rounded-sm hover:border-black/25 transition-all duration-100 ease-linear">
                                <CardHeader className="bg-primary-foreground p-0 gap-0 relative">
                                    <CardTitle>
                                        <img
                                            className="aspect-video h-35 lg:h-50 object-cover object-center z-10"
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
                                            <small className="text-[4px] lg:text-[10px]">{item.status}</small>
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardDescription className="p-2 lg:p-4 text-[10px] font-medium lg:text-base text-primary flex flex-col">
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
                                    <Link href={`update/${item.id}`}>
                                        Manage Item
                                    </Link>
                                </Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                ))
            ) : (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <IconFolderCode />
                        </EmptyMedia>
                        <EmptyTitle>Reports Not Found</EmptyTitle>
                    </EmptyHeader>
                </Empty>
            )}
        </>
    )
}

export function LostItemsCardSheet() {
    const [items, setItems] = useState<{
        lostItems: Item[];
        foundItems: Item[];
    }>({
        lostItems: [],
        foundItems: [],
    });
    const formattedDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    useEffect(() => {
        const getUsers = async () =>
            await Promise.all([getUserFoundItems(), getUserLostItems()]);
        const fetchUsers = async () => {
            const [[found], [lost]] = await getUsers();

            setItems({ foundItems: found.foundItems, lostItems: lost.lostItems });
        };

        fetchUsers();
    }, []);
    return (
        <>
            {items.lostItems.length > 0 ? (
                items.lostItems.map((item) => (
                    <Sheet key={item.id}>
                        <SheetTrigger className="cursor-pointer p-0" asChild>
                            <Card className="w-26 lg:w-50 flex gap-0 bg-transparent overflow-hidden border rounded-sm hover:border-black/25 transition-all duration-100 ease-linear">
                                <CardHeader className="bg-primary-foreground p-0 gap-0 relative">
                                    <CardTitle>
                                        <img
                                            className="aspect-video h-35 lg:h-50 object-cover object-center z-10"
                                            src={
                                                item?.attachments.length > 0
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
                                            <small className="text-[4px] lg:text-[10px]">{item.status}</small>
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardDescription className="p-2 lg:p-4 text-[10px] font-medium lg:text-base text-primary flex flex-col">
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
                                    <Link href={`update/${item.id}`}>
                                        Manage Item
                                    </Link>
                                </Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                ))
            ) : (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <IconFolderCode />
                        </EmptyMedia>
                        <EmptyTitle>Reports Not Found</EmptyTitle>
                    </EmptyHeader>
                </Empty>
            )}
        </>
    )
}