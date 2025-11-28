import * as React from "react";

import { SearchForm } from "@/components/search-form";
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

// This is sample data.
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

export function AppSidebar({
   searchItem,
   setSearchItem,
   activeSortBy,
   setActiveSortBy,
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
   activeCategory: string;
   setActiveCategory: (q: string) => void;
   activeStatus: string;
   setActiveStatus: (q: string) => void;
} & React.ComponentProps<typeof Sidebar>) {
   return (
      <Sidebar className="mt-13" {...props}>
         <SidebarHeader>
            <SidebarGroupLabel>Filter by Search</SidebarGroupLabel>
            <SearchForm
               value={searchItem}
               onChange={(e) =>
                  setSearchItem((e.target as HTMLInputElement).value)
               }
            />
         </SidebarHeader>
         <SidebarContent>
            {data.navMain.map((group) => (
               <SidebarGroup key={group.title}>
                  <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                  <SidebarGroupContent>
                     <SidebarMenu>
                        {group.items.map((item) => {
                           const isActive =
                              group.title === "Sort By"
                                 ? activeSortBy === item.title
                                 : group.title === "Category"
                                 ? activeCategory === item.title
                                 : activeStatus === item.title;

                           const handleClick = () => {
                              if (group.title === "Sort By") {
                                 setActiveSortBy(isActive ? "" : item.title);
                              } else if (group.title === "Category") {
                                 setActiveCategory(isActive ? "" : item.title);
                              } else
                                 setActiveStatus(isActive ? "" : item.title);
                           };
                           return (
                              <SidebarMenuItem key={item.title}>
                                 <SidebarMenuButton
                                    className={`cursor-pointer ${
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
         </SidebarContent>
         <SidebarRail />
      </Sidebar>
   );
}
