"use client";

import { useAuth } from "@/contexts/auth/AuthContext";
import { NavigationBar } from "@/components/navigationbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FoundItemsCardSheet, LostItemsCardSheet } from "@/components/profile-card-sheet";

export default function Profile() {
   const { user } = useAuth();

   return (
      <div className="w-auto h-max">
         <NavigationBar />
         <div className="w-full h-100 relative flex items-center mb-5">
            <img
               className="absolute top-0 h-1/2 w-full object-cover object-bottom z-0"
               src="https://imgs.search.brave.com/Beqi5bF2_fwfT7rQMUy6BlKvbb0wS90TCr9OA3Fl1lI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDYyOTc5/ODIuanBn"
               alt="profile background"
            />
            <div className="w-full flex items-end gap-3 lg:gap-5 px-8 lg:px-32">
               <Avatar className="content-end w-max h-30 lg:h-50 border-3 lg:border-5 border-white">
                  <AvatarImage
                     src="https://github.com/shadcn.png"
                     alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
               <h1 className="text-2xl lg:text-4xl font-extrabold text-primary tracking-tight z-10 mb-5 lg:mb-10">
                  {user?.name}
               </h1>
            </div>
         </div>
         <div className="w-full flex justify-center border-t pt-10 px-8">
            <Tabs defaultValue="foundItems">
               <div className="w-full flex justify-center">
                  <TabsList className="w-75 h-auto bg-primary-foreground border shadow-inner p-1">
                     <TabsTrigger
                        className="text-xs lg:text-sm cursor-pointer py-2 data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                        value="foundItems">
                        Found Items
                     </TabsTrigger>
                     <TabsTrigger
                        className="text-xs lg:text-sm cursor-pointer py-2 data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                        value="lostItems">
                        Lost Items
                     </TabsTrigger>
                  </TabsList>
               </div>
               <div className="my-10 mt-10 bg-transparent px-0 rounded-md flex">
                  <TabsContent className="flex flex-wrap justify-center gap-5" value="foundItems">
                     <FoundItemsCardSheet />
                  </TabsContent>
                  <TabsContent className="flex flex-wrap justify-center gap-5" value="lostItems">
                     <LostItemsCardSheet />

                  </TabsContent>
               </div>
            </Tabs>
         </div>
      </div>
   );
}
