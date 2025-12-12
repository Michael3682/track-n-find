"use client";

import { Logs } from "@/types/types";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavigationBar } from "@/components/navigationbar";
import { ActivityLogSidebar } from "@/components/admin-sidebar";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import {
   SidebarInset,
   SidebarProvider,
   SidebarTrigger,
   useSidebar,
} from "@/components/ui/sidebar";
import { getLogs } from "@/lib/logService";

export default function Log() {
   return (
      <>
         <NavigationBar />
         <SidebarProvider>
            <ActivityLogs />
         </SidebarProvider>
      </>
   );
}

function ActivityLogs() {
   const { open } = useSidebar();
   const [logs, setLogs] = useState<Logs[]>([]);
   const [query, setQuery] = useState({ page: 1, limit: 20 });
   const isMobile = useIsMobile();
   const [searchItem, setSearchItem] = useState("");
   const [activeDate, setActiveDate] = useState("");
   const [activeSortBy, setActiveSortBy] = useState("");

   const filteredLogs = logs
      .filter((log) =>
         log.actorName.toLowerCase().includes(searchItem.toLowerCase())
      )
      .filter((item) => {
         if (!activeDate) return true;

         const itemDate = new Date(item.createdAt as Date);
         const now = new Date();

         switch (activeDate) {
            case "Today": {
               return itemDate.toDateString() === now.toDateString();
            }

            case "This Week": {
               const weekStart = new Date(now);
               weekStart.setHours(0, 0, 0, 0);
               weekStart.setDate(now.getDate() - now.getDay());

               const weekEnd = new Date(weekStart);
               weekEnd.setDate(weekStart.getDate() + 7);

               return itemDate >= weekStart && itemDate < weekEnd;
            }

            case "This Month": {
               return (
                  itemDate.getFullYear() === now.getFullYear() &&
                  itemDate.getMonth() === now.getMonth()
               );
            }

            case "This Year": {
               return itemDate.getFullYear() === now.getFullYear();
            }

            default:
               return true;
         }
      })
      .sort((a, b) => {
         if (!activeSortBy) return 0;
         switch (activeSortBy) {
            case "Newest First":
               return (
                  new Date(b.createdAt as Date).getTime() -
                  new Date(a.createdAt as Date).getTime()
               );
            case "Oldest First":
               return (
                  new Date(a.createdAt as Date).getTime() -
                  new Date(b.createdAt as Date).getTime()
               );
            case "Alphabetical (A-Z)":
               return a.actorName.localeCompare(b.actorName);
            case "Alphabetical (Z-A)":
               return b.actorName.localeCompare(a.actorName);
            default:
               return 0;
         }
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
      getLogs({ page: query.page, limit: query.limit }).then(([data]) =>
         setLogs(data.logs)
      );
   }, [query.page, query.limit]);

   return (
      <>
         <ActivityLogSidebar
            searchItem={searchItem}
            setSearchItem={setSearchItem}
            activeSortBy={activeSortBy}
            setActiveSortBy={setActiveSortBy}
            activeDate={activeDate}
            setActiveDate={setActiveDate}
         />
         <SidebarInset className="mt-13">
            <header className="flex items-center border-b px-5 py-1 bg-sidebar">
               <Label
                  htmlFor="filter"
                  className="flex items-center gap-2 p-2 cursor-pointer text-primary">
                  <SidebarTrigger
                     id="filter"
                     className="-ml-1 cursor-pointer"
                  />
                  <p>
                     {isMobile
                        ? !open
                           ? "Hide Filters"
                           : "Show Filters"
                        : open
                        ? "Hide Filters"
                        : "Show Filters"}
                  </p>
               </Label>
            </header>
            <div className="p-8">
               <h1 className="text-4xl font-extrabold tracking-tight mb-8">
                  Activity Logs
               </h1>
               <Table className="rounded-full">
                  <TableHeader>
                     <TableRow className="bg-muted">
                        <TableHead>User</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Time</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredLogs.map((item) => (
                        <TableRow key={item.id}>
                           <TableCell>{item.actorName}</TableCell>
                           <TableCell>{item.action}</TableCell>
                           <TableCell>
                              {formattedDate(item.createdAt as Date)}
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </div>
         </SidebarInset>
      </>
   );
}
