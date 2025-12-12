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
   activityLogs: [
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
   ],
   manageUsers: [
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
         title: "Role",
         items: [
            {
               title: "User",
               isActive: false,
            },
            {
               title: "Admin",
               isActive: false,
            },
            {
               title: "Moderator",
               isActive: false,
            },
         ],
      },
   ],
   manageItems: [
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
         title: "Category",
         items: [
            {
               title: "Lost Item",
               isActive: false,
            },
            {
               title: "Found Item",
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

export function ActivityLogSidebar({
   searchItem,
   setSearchItem,
   activeSortBy,
   setActiveSortBy,
   activeDate,
   setActiveDate,
   ...props
}: {
   searchItem: string;
   setSearchItem: (q: string) => void;
   activeSortBy: string;
   setActiveSortBy: (q: string) => void;
   activeDate: string;
   setActiveDate: (q: string) => void;
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
            {data.activityLogs.map((group) => (
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
                                 : false;

                           const handleClick = () => {
                              if (group.title === "Sort By") {
                                 setActiveSortBy(isActive ? "" : item.title);
                              } else if (group.title === "Date") {
                                 setActiveDate(isActive ? "" : item.title);
                              }
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
               }}>
               Clear Filters
            </Button>
         </SidebarContent>
         <SidebarRail />
      </Sidebar>
   );
}

export function ManageUserSidebar({
   searchItem,
   setSearchItem,
   activeSortBy,
   setActiveSortBy,
   activeDate,
   setActiveDate,
   activeRole,
   setActiveRole,
   ...props
}: {
   searchItem: string;
   setSearchItem: (q: string) => void;
   activeSortBy: string;
   setActiveSortBy: (q: string) => void;
   activeDate: string;
   setActiveDate: (q: string) => void;
   activeRole: string;
   setActiveRole: (q: string) => void;
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
            {data.manageUsers.map((group) => (
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
                                 : activeRole === item.title;

                           const handleClick = () => {
                              if (group.title === "Sort By") {
                                 setActiveSortBy(isActive ? "" : item.title);
                              } else if (group.title === "Date") {
                                 setActiveDate(isActive ? "" : item.title);
                              } else setActiveRole(isActive ? "" : item.title);
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
                  setActiveRole("");
               }}>
               Clear Filters
            </Button>
         </SidebarContent>
         <SidebarRail />
      </Sidebar>
   );
}

export function ManageItemsSidebar({
   searchItem,
   setSearchItem,
   activeSortBy,
   setActiveSortBy,
   activeDate,
   setActiveDate,
   activeCategory,
   setActiveCategory,
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
   activeCategory: string;
   setActiveCategory: (q: string) => void;
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
            {data.manageItems.map((group) => (
               <SidebarGroup key={group.title}>
                  <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                  <SidebarGroupContent>
                     <SidebarMenu>
                        {group.items.map((item) => {
                           const isActive =
                              group.title == "Sort By"
                                 ? activeSortBy == item.title
                                 : group.title == "Date"
                                 ? activeDate == item.title
                                 : group.title == "Category"
                                 ? activeCategory == item.title
                                 : activeStatus == item.title;

                           const handleClick = () => {
                              if (group.title == "Sort By") {
                                 setActiveSortBy(isActive ? "" : item.title);
                              } else if (group.title == "Date") {
                                 setActiveDate(isActive ? "" : item.title);
                              } else if (group.title == "Category") {
                                 setActiveCategory(isActive ? "" : item.title);
                              } else {
                                 setActiveStatus(isActive ? "" : item.title);
                              }
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
                  setActiveSortBy("");
                  setActiveDate("");
                  setActiveCategory("");
                  setActiveStatus("");
               }}>
               Clear Filters
            </Button>
         </SidebarContent>
         <SidebarRail />
      </Sidebar>
   );
}
