"use client";

import { useAuth } from "@/contexts/auth/AuthContext";
import { NavigationBar } from "@/components/navigationbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArchiveItemsCardSheet, FoundItemsCardSheet, LostItemsCardSheet } from "@/components/profile-card-sheet";

export default function Profile() {
   const { user } = useAuth();

   return (
      <div className="w-auto h-max">
         <NavigationBar />
         <div className="w-full h-50 lg:h-100 relative flex items-center my-12 lg:my-0">
            <div className="w-full flex flex-col items-center gap-3 lg:gap-5 px-8 pt-8 lg:px-32">
               <Avatar className="content-end w-max h-30 lg:h-50 border-3 lg:border-5 border-primary">
                  <AvatarImage
                     src="https://github.com/shadcn.png"
                     alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
               <h1 className="text-4xl font-extrabold text-primary tracking-tight z-10 mb-5 lg:mb-10">
                  {user?.name}
               </h1>
            </div>
         </div>
         <div className="w-full flex justify-center border-t pt-10 px-8">
            <Tabs defaultValue="foundItems">
               <div className="w-full flex justify-center">
                  <TabsList className="w-90 lg:w-110 h-auto bg-muted border shadow-inner p-1">
                     <TabsTrigger
                        className="text-xs lg:text-sm text-primary cursor-pointer py-2 data-[state=active]:bg-background data-[state=active]:text-primary"
                        value="foundItems">
                        Found Items
                     </TabsTrigger>
                     <TabsTrigger
                        className="text-xs lg:text-sm text-primary cursor-pointer py-2 data-[state=active]:bg-background data-[state=active]:text-primary"
                        value="lostItems">
                        Lost Items
                     </TabsTrigger>
                     <TabsTrigger
                        className="text-xs lg:text-sm text-primary cursor-pointer py-2 data-[state=active]:bg-background data-[state=active]:text-primary"
                        value="archive">
                        Archived Items
                     </TabsTrigger>
                  </TabsList>
               </div>
               <div className="my-10 mt-10 bg-transparent px-0 rounded-md flex">
                  <TabsContent
                     className="flex flex-wrap justify-start gap-4"
                     value="foundItems">
                     <FoundItemsCardSheet />
                  </TabsContent>
                  <TabsContent
                     className="flex flex-wrap justify-start gap-4"
                     value="lostItems">
                     <LostItemsCardSheet />
                  </TabsContent>
                  <TabsContent
                     className="flex flex-wrap justify-start gap-4"
                     value="archive"
                  >
                     <ArchiveItemsCardSheet />
                  </TabsContent>
               </div>
            </Tabs>
         </div>
      </div>
   );
}
