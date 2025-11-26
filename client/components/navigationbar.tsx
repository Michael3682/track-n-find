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
   const [isScrolled, setIsScrolled] = useState(false);
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

   const handleScroll = () => {
      if (window.scrollY > 50) {
         setIsScrolled(true);
      } else {
         setIsScrolled(false);
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
      document.addEventListener("scroll", handleScroll);

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
         document.removeEventListener("scroll", handleScroll);
      };
   }, []);
   return (
      <div
         className={cn(
            `w-screen flex justify-between items-center gap-10 px-10 fixed py-1 z-50 border border-b border-transparent ${
               isScrolled
                  ? "bg-[rgb(245,245,245)] border-black/10"
                  : "bg-black/50 backdrop-blur-xl"
            } transition-all duration-300 ease-linear`,
            className
         )}>
         <Button
            variant="ghost"
            className="h-auto pl-0 cursor-pointer hover:bg-transparent">
            <Link href="/homepage">
               <img
                  className="h-8 contrast-150 drop-shadow drop-shadow-white"
                  src="track-n-find--logo.png"
                  alt="logo"
               />
            </Link>
         </Button>
         <div className="flex gap-5 items-center p-2 overflow-hidden background-blur-2xl">
            <Button
               className={`rounded-md cursor-pointer ${
                  isScrolled
                     ? "text-[rgb(20,20,20)] hover:bg-black/90 hover:text-[rgb(245,245,245)]"
                     : "text-[rgb(245,245,245)]"
               } transition-all duration-150 ease-linear`}
               variant="ghost">
               <Link className="py-0" href="/home">
                  Home
               </Link>
            </Button>
            <Button
               className={`rounded-md cursor-pointer ${
                  isScrolled
                     ? "text-[rgb(20,20,20)] hover:bg-black/90 hover:text-[rgb(245,245,245)]"
                     : "text-[rgb(245,245,245)]"
               } transition-all duration-150 ease-linear`}
               variant="ghost">
               <Link href="/browse">Browse</Link>
            </Button>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button
                     className={`rounded-md cursor-pointer ${
                        isScrolled
                           ? "text-[rgb(20,20,20)] hover:bg-black/90 hover:text-[rgb(245,245,245)]"
                           : "text-[rgb(245,245,245)]"
                     } transition-all duration-150 ease-linear`}
                     variant="ghost"
                     onPointerDown={handleDropdownToggle}>
                     Report
                     <ChevronUp
                        className={
                           isClicked
                              ? "rotate-180 transition-transform duration-75 ease-linear"
                              : "rotate-0 transition-transform duration-75 ease-linear"
                        }
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
               className={`rounded-md cursor-pointer ${
                  isScrolled
                     ? "text-[rgb(20,20,20)] hover:bg-black/90 hover:text-[rgb(245,245,245)]"
                     : "text-[rgb(245,245,245)]"
               } transition-all duration-150 ease-linear`}
               variant="ghost">
               <Link href="/messages">Messages</Link>
            </Button>
            <Button
               className={`rounded-md cursor-pointer ${
                  isScrolled
                     ? "text-[rgb(20,20,20)] hover:bg-black/90 hover:text-[rgb(245,245,245)]"
                     : "text-[rgb(245,245,245)]"
               } transition-all duration-150 ease-linear`}
               variant="ghost">
               <Link href="/profile">Profile</Link>
            </Button>
         </div>
         <Button
            className="bg-blue-600 rounded-md hover:bg-blue-700 cursor-pointer"
            onClick={() => handleLogout()}>
            <Link className="flex p-2 items-center gap-2" href="/">
               <LogOut />
               Logout
            </Link>
         </Button>
      </div>
   );
}
