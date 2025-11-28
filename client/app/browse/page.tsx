"use client";

import { useState } from "react";
import { CardSheet } from "@/components/card-sheet";
import { AppSidebar } from "@/components/app-sidebar";
import { NavigationBar } from "@/components/navigationbar";
import {
   SidebarInset,
   SidebarProvider,
   SidebarTrigger,
   useSidebar,
} from "@/components/ui/sidebar";

export default function Page() {
   const [searchItem, setSearchItem] = useState("");
   const [activeSortBy, setActiveSortBy] = useState("");
   const [activeCategory, setActiveCategory] = useState("");
   const [activeStatus, setActiveStatus] = useState("");

   return (
      <div className="w-auto h-auto relative overflow-x-hidden">
         <NavigationBar />
         <SidebarProvider className="mt-13">
            <SidebarGroupContent
               searchItem={searchItem}
               setSearchItem={setSearchItem}
               activeSortBy={activeSortBy}
               setActiveSortBy={setActiveSortBy}
               activeCategory={activeCategory}
               setActiveCategory={setActiveCategory}
               activeStatus={activeStatus}
               setActiveStatus={setActiveStatus}
            />
         </SidebarProvider>
      </div>
   );
}

function SidebarGroupContent({
   searchItem,
   setSearchItem,
   activeSortBy,
   setActiveSortBy,
   activeCategory,
   setActiveCategory,
   activeStatus,
   setActiveStatus,
}: {
   searchItem: string;
   setSearchItem: (q: string) => void;
   activeSortBy: string;
   setActiveSortBy: (q: string) => void;
   activeCategory: string;
   setActiveCategory: (q: string) => void;
   activeStatus: string;
   setActiveStatus: (q: string) => void;
}) {
   const { open } = useSidebar();

   return (
      <>
         <AppSidebar
            searchItem={searchItem}
            setSearchItem={setSearchItem}
            activeSortBy={activeSortBy}
            setActiveSortBy={setActiveSortBy}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            activeStatus={activeStatus}
            setActiveStatus={setActiveStatus}
         />
         <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-t px-4">
               <SidebarTrigger className="-ml-1" />
               <p>{open ? "Hide Filters" : "Show Filters"}</p>
            </header>
            <CardSheet
               searchItem={searchItem}
               activeSortBy={activeSortBy}
               activeCategory={activeCategory}
               activeStatus={activeStatus}
            />
         </SidebarInset>
      </>
   );
}
