"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { changeTheme, logout } from "@/lib/authService";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
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
   UserRoundCog,
   Moon,
   Sun,
   Logs,
   FileCog,
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
   const router = useRouter();
   const isMobile = useIsMobile();
   const { refetch, user } = useAuth();
   const [isClicked, setIsClicked] = useState(false);
   const [theme, setTheme] = useState<"LIGHT" | "DARK">("LIGHT");

   const handleLogout = async () => {
      const [data, err] = await logout();

      if (err || !data.success) {
         return console.log("There is a problem logging out");
      }

      await refetch();
      router.refresh();
   };

   const handleThemeMode = async () => {
      setTheme((prev) => (prev == "DARK" ? "LIGHT" : "DARK"));

      await changeTheme(theme == "DARK" ? "LIGHT" : "DARK");
   };

   useEffect(() => {
      if (!user) return;

      setTheme(user.theme);
   }, [user]);

   useEffect(() => {
      if (!theme) return;

      if (theme == "DARK") {
         document.body.classList.add("dark");
      }

      if (theme == "LIGHT") {
         document.body.classList.remove("dark");
      }
   }, [theme]);

   const NavButtons = ({ mobile = false }: { mobile?: boolean }) => {
      const navItems = [
         {
            icon: House,
            href: "/",
            label: "Home",
         },
         {
            icon: Search,
            href: "/browse",
            label: "Browse",
         },
         {
            icon: MessageCircle,
            href: "/messages",
            label: "Messages",
         },
         {
            icon: UserRound,
            href: "/profile",
            label: "Profile",
         },
      ];

      if (["ADMIN", "MODERATOR"].includes(user?.role!)) {
         navItems.push(
            {
               icon: Logs,
               href: "/logs/activity",
               label: "Logs",
            },
            {
               icon: UserRoundCog,
               href: "/logs/users",
               label: "Manage Users",
            },
            {
               icon: FileCog,
               href: "/logs/items",
               label: "Manage Items",
            }
         );
      }

      return (
         <>
            {navItems.map(({ icon: Icon, href, label }: any) => (
               <div key={href} className="flex items-center">
                  {mobile && <Icon className="text-primary" size={18} />}
                  <Button
                     variant="ghost"
                     className="px-3 rounded-none cursor-pointer lg:border-b border-transparent hover:border-ring">
                     <Link
                        className={`text-primary ${
                           mobile ? "text-xs" : "text-sm"
                        }`}
                        href={href}>
                        {label}
                     </Link>
                  </Button>
               </div>
            ))}
         </>
      );
   };

   const DropDownButtons = ({ mobile = false }: { mobile?: boolean }) => {
      return (
         <DropdownMenu open={isClicked} onOpenChange={setIsClicked}>
            <DropdownMenuTrigger asChild>
               <div className="flex items-center">
                  {mobile && (
                     <ClipboardList className="text-primary" size={18} />
                  )}
                  <Button
                     variant="ghost"
                     className="rounded-none cursor-pointer text-xs lg:text-sm text-primary lg:border-b border-transparent hover:border-ring">
                     Report
                     <ChevronUp
                        className={`transition-transform
                                    ${
                                       mobile
                                          ? isClicked
                                             ? "-rotate-90"
                                             : "rotate-90"
                                          : isClicked
                                          ? "rotate-0"
                                          : "rotate-180"
                                    }
                                 `}
                     />
                  </Button>
               </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
               side={`${mobile ? "right" : "bottom"}`}
               className="p-2">
               <DropdownMenuItem className="p-2 cursor-pointer text-primary">
                  <Link href="/report/lost">Lost Item</Link>
               </DropdownMenuItem>
               <DropdownMenuItem className="p-2 cursor-pointer text-primary">
                  <Link href="/report/found">Found Item</Link>
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      );
   };

   const ActionButtons = ({ mobile = false }: { mobile?: boolean }) => {
      return (
         <SheetFooter
            className={`flex flex-row justify-between ${
               !mobile ? "gap-3" : ""
            } p-0 m-0`}>
            <Button
               className="cursor-pointer bg-primary"
               onClick={handleThemeMode}>
               {theme === "DARK" ? <Moon /> : <Sun />}
            </Button>
            <Button
               className="grow border bg-transparent rounded-md text-primary hover:bg-transparent hover:text-red-500 hover:shadow-md cursor-pointer"
               onClick={() => handleLogout()}>
               <Link
                  className="flex p-2 items-center gap-2 text-inherit"
                  href="/">
                  <LogOut />
               </Link>
            </Button>
         </SheetFooter>
      );
   };

   return (
      <Sheet>
         <div
            className={cn(
               "w-full flex justify-end lg:justify-between items-center gap-10 px-3 lg:px-8 py-2 lg:py-0 top-0 fixed z-50 border-b bg-secondary transition-colors duration-300 ease-linear",
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
                                 src="/logo.svg"
                                 alt="logo"
                              />
                              TrackNFind
                           </Link>
                        </Button>
                     </SheetTitle>
                  </SheetHeader>
                  <Separator />
                  <div className="flex flex-col gap-5 items-start py-8 overflow-hidden background-blur-2xl">
                     <NavButtons mobile />
                     <DropDownButtons mobile />
                  </div>
                  <ActionButtons />
               </SheetContent>
            ) : (
               <>
                  <Button
                     variant="ghost"
                     className="h-auto pl-0 cursor-pointer">
                     <Link href="/">
                        <img
                           className="h-8 contrast-150"
                           src="/logo.svg"
                           alt="logo"
                        />
                     </Link>
                  </Button>
                  <div className="flex gap-5 items-center p-2 overflow-hidden background-blur-2xl">
                     <NavButtons />
                     <DropDownButtons />
                  </div>
                  <ActionButtons />
               </>
            )}
         </div>
      </Sheet>
   );
}
