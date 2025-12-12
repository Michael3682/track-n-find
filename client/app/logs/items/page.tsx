"use client";

import { Item } from "@/types/types";
import { Ellipsis } from "lucide-react";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { getItems } from "@/lib/reportService";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavigationBar } from "@/components/navigationbar";
import { ManageItemsSidebar } from "@/components/admin-sidebar";
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
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
   const isMobile = useIsMobile();
   const [items, setItems] = useState<Item[]>([]);
   const [query, setQuery] = useState({ page: 1, limit: 20 });
   const [searchItem, setSearchItem] = useState("");
   const [activeSortBy, setActiveSortBy] = useState("");
   const [activeCategory, setActiveCategory] = useState("");
   const [activeDate, setActiveDate] = useState("");
   const [activeStatus, setActiveStatus] = useState("");

   const filteredItems = items
      .filter(
         (item) =>
            item.name.toLowerCase().includes(searchItem.toLowerCase()) ||
            item.author.name.toLowerCase().includes(searchItem.toLowerCase())
      )
      .filter((item) =>
         activeCategory
            ? item.type == activeCategory.split(" ")[0].toUpperCase()
            : true
      )
      .filter((item) =>
         activeStatus ? item.status == activeStatus.toUpperCase() : true
      )
      .filter((item) => {
         if (!activeDate) return true;

         const itemDate = new Date(item.date_time);
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
                  new Date(b.date_time as Date).getTime() -
                  new Date(a.date_time as Date).getTime()
               );
            case "Oldest First":
               return (
                  new Date(a.date_time as Date).getTime() -
                  new Date(b.date_time as Date).getTime()
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
   }, []);

   return (
      <>
         <ManageItemsSidebar
            searchItem={searchItem}
            setSearchItem={setSearchItem}
            activeSortBy={activeSortBy}
            setActiveSortBy={setActiveSortBy}
            activeDate={activeDate}
            setActiveDate={setActiveDate}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            activeStatus={activeStatus}
            setActiveStatus={setActiveStatus}
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
                  Manage Items
               </h1>
               <Table className="rounded-full">
                  <TableHeader>
                     <TableRow className="bg-muted">
                        <TableHead>Item</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Date Reported</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredItems.map((item) => (
                        <TableRow key={item.id}>
                           <TableCell>{item.name}</TableCell>
                           <TableCell>
                              {item.type == "FOUND" ? "Found" : "Lost"}
                           </TableCell>
                           <TableCell>{item.author.name}</TableCell>
                           <TableCell>
                              {formattedDate(item.date_time)}
                           </TableCell>
                           <TableCell
                              className={`font-semibold ${
                                 item.status == "CLAIMED"
                                    ? "text-green-400"
                                    : "text-red-400"
                              }`}>
                              {item.status}
                           </TableCell>
                           <TableCell>
                              <DropdownMenu>
                                 <DropdownMenuTrigger className="p-1 cursor-pointer">
                                    <Ellipsis size={18} />
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent>
                                    <DropdownMenuLabel>
                                       Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer">
                                       ...
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">
                                       ...
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">
                                       ...
                                    </DropdownMenuItem>
                                 </DropdownMenuContent>
                              </DropdownMenu>
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
