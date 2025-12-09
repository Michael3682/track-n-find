"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppSidebar } from "@/components/app-sidebar";
import { NavigationBar } from "@/components/navigationbar";
import { BrowseCardSheet } from "@/components/browse-card-sheet";
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
   const isMobile = useIsMobile();

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
         <SidebarInset className="bg-background">
            <header className="flex h-16 items-center border-b px-4 bg-sidebar">
               <Label htmlFor="filter" className="flex items-center gap-2 p-2 cursor-pointer text-primary">
                  <SidebarTrigger
                     id="filter"
                     className="-ml-1 cursor-pointer"
                  />
                  <p>
                     {isMobile ? (!open ? "Hide Filters" : "Show Filters") : (open ? "Hide Filters" : "Show Filters")}
                  </p>
               </Label>
            </header>
            <BrowseCardSheet
               searchItem={searchItem}
               activeSortBy={activeSortBy}
               activeCategory={activeCategory}
               activeStatus={activeStatus}
            />
         </SidebarInset>
      </>
   );
}
