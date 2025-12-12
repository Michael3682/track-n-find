"use client";

import { Ellipsis } from "lucide-react";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavigationBar } from "@/components/navigationbar";
import { ManageUserSidebar } from "@/components/admin-sidebar";
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
import { getAllUser } from "@/lib/authService";
import { User } from "@/types/types";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useRouter } from "next/navigation";

export default function Log() {
   const { user, isLoading } = useAuth()
   const router = useRouter()

   useEffect(() => {
      if (!isLoading && (!user || user.role != "ADMIN")) {
      router.push("/")
      }
   }, [user, isLoading, router])

   if(isLoading || !user || user.role !== "ADMIN") return (
      <div className="h-screen flex items-center justify-center">
         <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
      </div>
   )
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
   const [users, setUsers] = useState<User[]>([]);
   const [query, setQuery] = useState({ page: 1, limit: 20 });
   const [searchItem, setSearchItem] = useState("");
   const [activeSortBy, setActiveSortBy] = useState("");
   const [activeDate, setActiveDate] = useState("");
   const [activeRole, setActiveRole] = useState("");

   const filteredUsers = users
      .filter((user) =>
         user.name.toLowerCase().includes(searchItem.toLowerCase())
   )
      .filter((user) => activeRole ? user.role == activeRole.toUpperCase() : true)
      .filter((user) => {
         if (!activeDate) return true;

         const userDate = new Date(user.createdAt as Date);
         const now = new Date();

         switch (activeDate) {
            case "Today": {
               return userDate.toDateString() === now.toDateString();
            }

            case "This Week": {
               const weekStart = new Date(now);
               weekStart.setHours(0, 0, 0, 0);
               weekStart.setDate(now.getDate() - now.getDay());

               const weekEnd = new Date(weekStart);
               weekEnd.setDate(weekStart.getDate() + 7);

               return userDate >= weekStart && userDate < weekEnd;
            }

            case "This Month": {
               return (
                  userDate.getFullYear() === now.getFullYear() &&
                  userDate.getMonth() === now.getMonth()
               );
            }

            case "This Year": {
               return userDate.getFullYear() === now.getFullYear();
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
      getAllUser({ page: query.page, limit: query.limit }).then(([data]) =>
         setUsers(data.users)
      );
   }, [query.page, query.limit]);

   return (
      <>
         <ManageUserSidebar
            searchItem={searchItem}
            setSearchItem={setSearchItem}
            activeSortBy={activeSortBy}
            setActiveSortBy={setActiveSortBy}
            activeDate={activeDate}
            setActiveDate={setActiveDate}
            activeRole={activeRole}
            setActiveRole={setActiveRole}
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
                  Manage Users
               </h1>
               <Table className="rounded-full">
                  <TableHeader>
                     <TableRow className="bg-muted">
                        <TableHead>User Id</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date Registered</TableHead>
                        <TableHead></TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                           <TableCell>{user.id}</TableCell>
                           <TableCell>{user.name}</TableCell>
                           <TableCell>{user.email}</TableCell>
                           <TableCell>{user.role}</TableCell>
                           <TableCell>
                              {formattedDate(user.createdAt)}
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
