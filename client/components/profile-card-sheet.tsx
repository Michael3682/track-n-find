"use client";

import Link from "next/link";
import { Item } from "@/types/types";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconFolderCode } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { getArchivedItems, getUserArchivedItems, getUserFoundItems, getUserLostItems } from "@/lib/reportService";
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
import CardSheet from "./card-sheet";

export function FoundItemsCardSheet() {
   const [items, setItems] = useState<{
      lostItems: Item[];
      foundItems: Item[];
   }>({
      lostItems: [],
      foundItems: [],
   });

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
               <CardSheet key={item.id} item={item}/>
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
   );
}

export function LostItemsCardSheet() {
   const [items, setItems] = useState<{
      lostItems: Item[];
      foundItems: Item[];
   }>({
      lostItems: [],
      foundItems: [],
   });

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
               <CardSheet key={item.id} item={item}/>
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
   );
}

export function ArchiveItemsCardSheet() {
   const [archived, setArchived] = useState<Item[]>([])

   useEffect(() => {
      getUserArchivedItems().then(([data]) => setArchived(data.items))
   }, [])

   return (
      <>
         {archived.length > 0 ? (
            archived.map((item) => (
               <CardSheet key={item.id} item={item}/>
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
