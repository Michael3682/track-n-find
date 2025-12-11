"use client";

import * as React from "react";

import { SearchForm } from "@/components/search-form";
import { Button } from "@/components/ui/button";
import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarRail,
} from "@/components/ui/sidebar";

const data = {
   navMain: [
      {
         title: "Sort By",
         items: [
            {
               title: "Newest First",
               isActive: false,
            },
            {
               title: "Oldest First",
               isActive: false,
            },
            {
               title: "Alphabetical (A-Z)",
               isActive: false,
            },
            {
               title: "Alphabetical (Z-A)",
               isActive: false,
            },
         ],
      },
      {
         title: "Date",
         items: [
            {
               title: "Today",
               isActive: false,
            },
            {
               title: "This Week",
               isActive: false,
            },
            {
               title: "This Month",
               isActive: false,
            },
            {
               title: "This Year",
               isActive: false,
            },
         ],
      },
      {
         title: "Status",
         items: [
            {
               title: "Claimed",
               isActive: false,
            },
            {
               title: "Unclaimed",
               isActive: false,
            },
         ],
      },
   ],
};

export function AdminSidebar({
   searchItem,
   setSearchItem,
   activeSortBy,
   setActiveSortBy,
   activeDate,
   setActiveDate,
   activeStatus,
   setActiveStatus,
   ...props
}: {
   searchItem: string;
   setSearchItem: (q: string) => void;
   activeSortBy: string;
   setActiveSortBy: (q: string) => void;
   activeDate: string;
   setActiveDate: (q: string) => void;
   activeStatus: string;
   setActiveStatus: (q: string) => void;
} & React.ComponentProps<typeof Sidebar>) {
   return (
      <Sidebar className="mt-13" {...props}>
         <SidebarHeader className="px-4">
            <SidebarGroupLabel>Filter by Search</SidebarGroupLabel>
            <SearchForm
               value={searchItem}
               onChange={(e) =>
                  setSearchItem((e.target as HTMLInputElement).value)
               }
            />
         </SidebarHeader>
         <SidebarContent className="px-4">
            {data.navMain.map((group) => (
               <SidebarGroup key={group.title}>
                  <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                  <SidebarGroupContent>
                     <SidebarMenu>
                        {group.items.map((item) => {
                           const isActive =
                              group.title === "Sort By"
                                 ? activeSortBy === item.title
                                 : group.title === "Date"
                                 ? activeDate === item.title
                                 : activeStatus === item.title;

                           const handleClick = () => {
                              if (group.title === "Sort By") {
                                 setActiveSortBy(isActive ? "" : item.title);
                              } else if (group.title === "Date") {
                                 setActiveDate(isActive ? "" : item.title);
                              } else
                                 setActiveStatus(isActive ? "" : item.title);
                           };
                           return (
                              <SidebarMenuItem key={item.title}>
                                 <SidebarMenuButton
                                    className={`cursor-pointer text-xs lg:text-sm ${
                                       isActive ? "border" : ""
                                    }`}
                                    isActive={isActive}
                                    onClick={handleClick}>
                                    {item.title}
                                 </SidebarMenuButton>
                              </SidebarMenuItem>
                           );
                        })}
                     </SidebarMenu>
                  </SidebarGroupContent>
               </SidebarGroup>
            ))}
            <Button
               variant="ghost"
               className="border mt-5 cursor-pointer text-primary hover:bg-muted"
               onClick={() => {
                  setSearchItem("");
                  setActiveDate("");
                  setActiveSortBy("");
                  setActiveStatus("");
               }}>
               Clear Filters
            </Button>
         </SidebarContent>
         <SidebarRail />
      </Sidebar>
   );
}
