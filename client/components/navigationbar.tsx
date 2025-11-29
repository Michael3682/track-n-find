import Link from "next/link";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/authService";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronUp, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/auth/AuthContext";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavigationBar({ className }: { className?: string }) {
   const [isClicked, setIsClicked] = useState(false);
   const router = useRouter();
   const { refetch } = useAuth();

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

   useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);
   return (
      <div
         className={cn(
            `w-full flex justify-between items-center gap-10 px-10 top-0 fixed z-50 border-b bg-white border-black/10 transition-colors duration-300 ease-linear`,
            className
         )}>
         <Button variant="ghost" className="h-auto pl-0 cursor-pointer">
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
               <Link className="py-0" href="/">
                  Home
               </Link>
            </Button>
            <Button
               variant="ghost"
               className="rounded-md cursor-pointer hover:bg-black/3">
               <Link href="/browse">Browse</Link>
            </Button>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button
                     variant="ghost"
                     className="rounded-md cursor-pointer hover:bg-black/3"
                     onPointerDown={handleDropdownToggle}>
                     Report
                     <ChevronUp
                        className={isClicked ? "rotate-0" : "rotate-180"}
                     />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent ref={dropdownRef} className="p-2 space-y-2">
                  <DropdownMenuItem className="font-semibold p-2 cursor-pointer text-[rgb(20,20,20)]">
                     <Link href="/report/lost">Lost Item</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="font-semibold p-2 cursor-pointer text-[rgb(20,20,20)]">
                     <Link href="/report/found">Found Item</Link>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
            <Button
               variant="ghost"
               className="rounded-md cursor-pointer hover:bg-black/3">
               <Link href="/messages">Messages</Link>
            </Button>
            <Button
               variant="ghost"
               className="rounded-md cursor-pointer hover:bg-black/3">
               <Link href="/profile">Profile</Link>
            </Button>
         </div>
         <Button
            className="border bg-transparent rounded-md text-black hover:bg-transparent hover:text-red-500 hover:shadow-md cursor-pointer"
            onClick={() => handleLogout()}>
            <Link
               className="flex p-2 items-center gap-2 text-inherit"
               href="/">
               <LogOut />
               Logout
            </Link>
         </Button>
      </div>
   );
}
