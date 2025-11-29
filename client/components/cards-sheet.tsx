"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getItems } from "@/lib/reportService";
import { Button } from "@/components/ui/button";
import { IconFolderCode } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
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

type Item = {
   id: string;
   name: string;
   description: string;
   category: string;
   date_time: string;
   location: string;
   attachments: string[];
   status: "CLAIMED" | "UNCLAIMED";
   type: "FOUND" | "LOST";
   associated_person: string;
};

export function CardsSheet({
   searchItem,
   activeSortBy,
   activeCategory,
   activeStatus,
}: {
   searchItem: string;
   activeSortBy: string;
   activeCategory: string;
   activeStatus: string;
}) {
   const [items, setItems] = useState<Item[]>([]);

   const filteredItems = items
      .filter((item) =>
         item.name.toLowerCase().includes(searchItem.toLowerCase())
      )
      .filter((item) =>
         activeCategory
            ? item.type == activeCategory.split(" ")[0].toUpperCase()
            : true
      )
      .filter((item) =>
         activeStatus ? item.status == activeStatus.toUpperCase() : true
      )
      .sort((a, b) => {
         if (!activeSortBy) return 0;
         switch (activeSortBy) {
            case "Newest First":
               return (
                  new Date(b.date_time).getTime() -
                  new Date(a.date_time).getTime()
               );
            case "Oldest First":
               return (
                  new Date(a.date_time).getTime() -
                  new Date(b.date_time).getTime()
               );
            case "Alphabetical (A-Z)":
               return a.name.localeCompare(b.name);
            case "Alphabetical (Z-A)":
               return b.name.localeCompare(a.name);
            default:
               return 0;
         }
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
      getItems().then(([data]) => setItems(data.items));
   }, []);

   return (
      <div className="flex flex-wrap justify-start gap-10 p-10">
         {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
               <Sheet key={item.id}>
                  <SheetTrigger className="cursor-pointer p-0" asChild>
                     <Card className="w-70 bg-transparent overflow-hidden border rounded-sm shadow-none hover:shadow-lg hover:border-transparent transition-all duration-100 ease-linear">
                        <CardHeader className="bg-primary-foreground p-5 shadow-inner border-b relative">
                           <CardTitle>
                              <img
                                 className="aspect-video h-50 object-contain object-top drop-shadow-lg drop-shadow-black/50 z-10"
                                 src={
                                    item?.attachments?.length > 0
                                       ? item.attachments[0]
                                       : undefined
                                 }
                                 alt="image"
                              />
                              <Badge
                                 className={`${
                                    item.status === "CLAIMED"
                                       ? "bg-green-400"
                                       : "bg-red-400"
                                 } z-50 absolute top-0 right-0 rounded-tl-none rounded-tr-sm rounded-bl-md rounded-br-none`}>
                                 <small>{item.status}</small>
                              </Badge>
                           </CardTitle>
                        </CardHeader>
                        <CardDescription className="p-5 pt-0 text-xl text-[rgb(20,20,20)] flex flex-col">
                           {item.name}
                           <small className="text-xs font-light text-muted-foreground">
                              {item.type}
                           </small>
                        </CardDescription>
                     </Card>
                  </SheetTrigger>
                  <SheetContent side="center">
                     <SheetHeader className="space-y-5">
                        <img
                           className="aspect-video object-contain object-top shadow-inner shadow-black/10 rounded-md p-5 drop-shadow-lg drop-shadow-black/50"
                           src={
                              item?.attachments?.length > 0
                                 ? item.attachments[0]
                                 : undefined
                           }
                           alt="image"
                        />
                        <div className="space-y-5">
                           <SheetTitle className="text-3xl">
                              {item.name}
                              <p className="text-xs font-light text-muted-foreground">
                                 Reported By:{" "}
                                 <span className="font-normal">
                                    {item.associated_person}
                                 </span>
                              </p>
                           </SheetTitle>
                           <div className="space-y-7">
                              <p className="text-lg text-muted-foreground">
                                 {item.description}
                              </p>
                              <Separator />
                              <div className="space-y-2">
                                 <p className="mt-5 text-base font-medium text-[rgb(20,20,20)] flex justify-between">
                                    Reported on:{" "}
                                    <span className="font-normal">
                                       {formattedDate(item.date_time)}
                                    </span>
                                 </p>
                                 <p className="text-base font-medium text-[rgb(20,20,20)]  flex justify-between">
                                    Location:{" "}
                                    <span className="font-normal">
                                       {item.location}
                                    </span>
                                 </p>
                                 <p className="text-base font-medium text-[rgb(20,20,20)]  flex justify-between">
                                    Status:{" "}
                                    <span className="font-semibold text-red-500">
                                       {item.status}
                                    </span>
                                 </p>
                              </div>
                           </div>
                        </div>
                     </SheetHeader>
                     <SheetFooter>
                        <Button
                           className="cursor-pointer"
                           type="submit"
                           asChild>
                           <Link href={`messages/${item.id}`}>
                              Message User
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
      </div>
   );
}
