"use client";

import { useEffect, useState } from "react";
import { getItems } from "@/lib/reportService";
import { IconFolderCode } from "@tabler/icons-react";
import {
   Empty,
   EmptyHeader,
   EmptyMedia,
   EmptyTitle,
} from "@/components/ui/empty";
import { Item } from "@/types/types";
import { useRouter } from "next/navigation";
import CardSheet from "./card-sheet";

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
   const router = useRouter();

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

   useEffect(() => {
      getItems().then(([data]) => setItems(data.items));
   }, []);

   console.log(items);
   return (
      <div className="flex flex-wrap justify-center lg:justify-start gap-4 p-8 lg:p-10">
         {filteredItems.length > 0 ? (
            filteredItems.map((item) => <CardSheet item={item} key={item.id} />)
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