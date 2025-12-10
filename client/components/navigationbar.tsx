"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { changeTheme, logout } from "@/lib/authService";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Separator } from "@/components/ui/separator";
import {
   ChevronUp,
   LogOut,
   Menu,
   House,
   Search,
   ClipboardList,
   MessageCircle,
   UserRound,
   Moon,
   Sun,
} from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   Sheet,
   SheetContent,
   SheetFooter,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";

export function NavigationBar({ className }: { className?: string }) {
   const [isClicked, setIsClicked] = useState(false);
   const [theme, setTheme] = useState<"LIGHT" | "DARK">("LIGHT")
   const router = useRouter();
   const { refetch, user } = useAuth();
   const isMobile = useIsMobile();

   const dropdownRef = useRef<HTMLDivElement | null>(null);

   const handleDropdownToggle = () => {
      setIsClicked(!isClicked);
   };

   const handleClickOutside = (e: MouseEvent) => {
      if (
         dropdownRef.current &&
         !dropdownRef.current.contains(e.target as Node)
      ) {
         setIsClicked(false);
      }
   };

   const handleLogout = async () => {
      const [data, err] = await logout();

      if (err || !data.success) {
         return console.log("There is a problem logging out");
      }

      await refetch();
      router.refresh();
   };

   const handleThemeMode = async () => {
      setTheme(prev => prev == "DARK" ? "LIGHT" : "DARK")

      await changeTheme(theme == "DARK" ? "LIGHT" : "DARK")

   };

   useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   useEffect(() => {
      if(!user) return

      setTheme(user.theme)
   }, [user])

   useEffect(() => {
      if(!theme) return

      if(theme == "DARK") {
         document.body.classList.add("dark")
      }

      if(theme == "LIGHT") {
         document.body.classList.remove("dark")
      }
   }, [theme])

   return (
      <Sheet>
         <div
            className={cn(
               "w-full flex justify-end lg:justify-between items-center gap-10 px-3 py-2 lg:py-0 top-0 fixed z-50 border-b bg-secondary transition-colors duration-300 ease-linear",
               className
            )}>
            <SheetTrigger asChild>
               <Button
                  className={`border bg-transparent rounded-md text-primary hover:bg-transparent ${
                     isMobile ? "flex" : "hidden"
                  }`}>
                  <Menu />
               </Button>
            </SheetTrigger>
            {isMobile ? (
               <SheetContent className="w-1/2 px-8 bg-sidebar" side="left">
                  <SheetHeader className="px-0 pb-0">
                     <SheetTitle>
                        <Button
                           variant="ghost"
                           className="px-0 h-auto cursor-pointer">
                           <Link
                              className="flex items-center gap-3 text-base font-semibold"
                              href="/">
                              <img
                                 className="h-8 contrast-150"
                                 src="/track-n-find--logo.png"
                                 alt="logo"
                              />
                              TrackNFind
                           </Link>
                        </Button>
                     </SheetTitle>
                  </SheetHeader>
                  <Separator />
                  <div className="flex flex-col gap-5 items-start py-8 overflow-hidden background-blur-2xl">
                     <div className="flex items-center">
                        <House className="text-primary" size={18} />
                        <Button
                           variant="ghost"
                           className="px-3 rounded-md cursor-pointer hover:bg-black/3">
                           <Link className="text-xs text-primary" href="/">
                              Home
                           </Link>
                        </Button>
                     </div>
                     <div className="flex items-center">
                        <Search className="text-primary" size={18} />
                        <Button
                           variant="ghost"
                           className="px-3 rounded-md cursor-pointer hover:bg-black/3">
                           <Link
                              className="text-xs text-primary"
                              href="/browse">
                              Browse
                           </Link>
                        </Button>
                     </div>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <div className="flex items-center">
                              <ClipboardList
                                 className="text-primary"
                                 size={18}
                              />
                              <Button
                                 variant="ghost"
                                 className="text-xs rounded-md cursor-pointer hover:bg-black/3"
                                 onPointerDown={handleDropdownToggle}>
                                 Report
                                 <ChevronUp
                                    className={
                                       isClicked ? "-rotate-90" : "rotate-90"
                                    }
                                 />
                              </Button>
                           </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                           side="right"
                           ref={dropdownRef}
                           className="p-2 space-y-2">
                           <DropdownMenuItem className="font-semibold p-2 cursor-pointer text-primary">
                              <Link className="text-xs" href="/report/lost">
                                 Lost Item
                              </Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem className="font-semibold p-2 cursor-pointer text-primary">
                              <Link className="text-xs" href="/report/found">
                                 Found Item
                              </Link>
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                     <div className="flex items-center">
                        <MessageCircle className="text-primary" size={18} />
                        <Button
                           variant="ghost"
                           className="rounded-md cursor-pointer hover:bg-black/3">
                           <Link className="text-xs" href="/messages">
                              Messages
                           </Link>
                        </Button>
                     </div>
                     <div className="flex items-center">
                        <UserRound className="text-primary" size={18} />
                        <Button
                           variant="ghost"
                           className="rounded-md cursor-pointer hover:bg-black/3">
                           <Link className="text-xs" href="/profile">
                              Profile
                           </Link>
                        </Button>
                     </div>
                  </div>
                  <SheetFooter className="p-0 pb-6">
                     <div className="space-x-5">
                        <Button
                           className="cursor-pointer bg-primary"
                           onClick={handleThemeMode}>
                           {theme === "DARK" ? <Moon /> : <Sun />}
                        </Button>
                        <Button
                           className="border bg-transparent rounded-md text-primary hover:bg-transparent hover:text-red-500 hover:shadow-md cursor-pointer"
                           onClick={() => handleLogout()}>
                           <Link
                              className="flex p-2 items-center gap-2 text-inherit"
                              href="/">
                              <LogOut />
                           </Link>
                        </Button>
                     </div>
                  </SheetFooter>
               </SheetContent>
            ) : (
               <>
                  <Button
                     variant="ghost"
                     className="h-auto pl-0 cursor-pointer">
                     <Link href="/">
                        <img
                           className="h-8 contrast-150"
                           src="/track-n-find--logo.png"
                           alt="logo"
                        />
                     </Link>
                  </Button>
                  <div className="flex gap-5 items-center p-2 overflow-hidden background-blur-2xl">
                     <Button
                        variant="ghost"
                        className="rounded-md cursor-pointer hover:bg-black/3">
                        <Link className="py-0 text-primary" href="/">
                           Home
                        </Link>
                     </Button>
                     <Button
                        variant="ghost"
                        className="rounded-md cursor-pointer hover:bg-black/3">
                        <Link className="text-primary" href="/browse">
                           Browse
                        </Link>
                     </Button>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button
                              variant="ghost"
                              className="rounded-md cursor-pointer text-primary hover:bg-black/3"
                              onPointerDown={handleDropdownToggle}>
                              Report
                              <ChevronUp
                                 className={
                                    isClicked ? "rotate-0" : "rotate-180"
                                 }
                              />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                           ref={dropdownRef}
                           className="p-2 space-y-2">
                           <DropdownMenuItem className="font-semibold p-2 cursor-pointer text-primary">
                              <Link href="/report/lost">Lost Item</Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem className="font-semibold p-2 cursor-pointer text-primary">
                              <Link href="/report/found">Found Item</Link>
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                     <Button
                        variant="ghost"
                        className="rounded-md cursor-pointer hover:bg-black/3">
                        <Link className="text-primary" href="/messages">
                           Messages
                        </Link>
                     </Button>
                     <Button
                        variant="ghost"
                        className="rounded-md cursor-pointer hover:bg-black/3">
                        <Link className="text-primary" href="/profile">
                           Profile
                        </Link>
                     </Button>
                  </div>
                  <div className="space-x-5">
                     <Button
                        className="cursor-pointer bg-primary"
                        onClick={handleThemeMode}>
                        {theme == "DARK" ? <Moon /> : <Sun />}
                     </Button>
                     <Button
                        className="border bg-transparent rounded-md text-primary hover:bg-transparent hover:text-red-500 hover:shadow-md cursor-pointer"
                        onClick={() => handleLogout()}>
                        <Link
                           className="flex p-2 items-center gap-2 text-inherit"
                           href="/">
                           <LogOut />
                        </Link>
                     </Button>
                  </div>
               </>
            )}
         </div>
      </Sheet>
   );
}
