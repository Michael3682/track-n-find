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
         url: "#",
         items: [
            {
               title: "Newest First",
               url: "#",
            },
            {
               title: "Oldest First",
               url: "#",
            },
            {
               title: "Alphabetical (A-Z)",
               url: "#",
            },
            {
               title: "Alphabetical (Z-A)",
               url: "#",
            },
         ],
      },
      {
         title: "Category",
         url: "#",
         items: [
            {
               title: "Lost Item",
               url: "#",
            },
            {
               title: "Found Item",
               url: "#",
               isActive: true,
            },
         ],
      },
   ],
};

export function AppSidebar({
   searchItem,
   setSearchItem,
   ...props
}: {
   searchItem: string;
   setSearchItem: (q: string) => void;
} & React.ComponentProps<typeof Sidebar>) {
   return (
      <Sidebar className="mt-15 border" {...props}>
         <SidebarHeader>
            <SidebarGroupLabel>Filter by Search</SidebarGroupLabel>
            <SearchForm
               value={searchItem}
               onChange={(e) => setSearchItem((e.target as HTMLInputElement).value)}
            />
         </SidebarHeader>
         <SidebarContent>
            {data.navMain.map((item) => (
               <SidebarGroup key={item.title}>
                  <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                  <SidebarGroupContent>
                     <SidebarMenu>
                        {item.items.map((item) => (
                           <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton
                                 asChild
                                 isActive={item.isActive}>
                                 <a href={item.url}>{item.title}</a>
                              </SidebarMenuButton>
                           </SidebarMenuItem>
                        ))}
                     </SidebarMenu>
                  </SidebarGroupContent>
               </SidebarGroup>
            ))}
         </SidebarContent>
         <SidebarRail />
      </Sidebar>
   );
}
