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

   return (
      <div className="w-auto h-auto relative overflow-x-hidden">
         <NavigationBar />
         <SidebarProvider className="mt-15">
            <SidebarGroupContent
               searchItem={searchItem}
               setSearchItem={setSearchItem}
            />
         </SidebarProvider>
      </div>
   );
}

function SidebarGroupContent({
   searchItem,
   setSearchItem,
}: {
   searchItem: string;
   setSearchItem: (q: string) => void;
}) {
   const { open } = useSidebar();

   return (
      <>
         <AppSidebar searchItem={searchItem} setSearchItem={setSearchItem} />
         <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-t px-4">
               <SidebarTrigger className="-ml-1" />
               <p>{open ? "Hide Filters" : "Show Filters"}</p>
            </header>
            <CardSheet searchItem={searchItem} />
         </SidebarInset>
      </>
   );
}
