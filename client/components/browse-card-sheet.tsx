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
import { Item } from "@/types/types";
import { useAuth } from "@/contexts/auth/AuthContext";
import { findOrCreateConversation } from "@/lib/chatService";
import { useRouter } from "next/navigation";


export function BrowseCardSheet({
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
   const { user } = useAuth()
   const router = useRouter()

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

   const formattedDate = (date: string | number | Date) => {
      if (!date) return
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
   }, []);
   return (
      <div className="flex flex-wrap justify-center lg:justify-start gap-4 p-8 lg:p-10">
         {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
               <Sheet key={item.id}>
                  <SheetTrigger className="cursor-pointer p-0" asChild>
                     <Card className="w-43 lg:w-50 flex-none gap-0 bg-transparent overflow-hidden border rounded-sm hover:border-black/25 transition-all duration-100 ease-linear">
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
                                 <small className="text-[8px] lg:text-[10px]">{item.status}</small>
                              </Badge>
                           </CardTitle>
                        </CardHeader>
                        <CardDescription className="p-2 lg:p-4 text-sm font-medium lg:text-base text-primary flex flex-col">
                           {item.name} 
                           <small className="text-[10px] lg:text-xs font-light text-muted-foreground">
                              {item.type}
                           </small>
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
