"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth/AuthContext";
import { NavigationBar } from "@/components/navigationbar";
import { getUserFoundItems, getUserLostItems } from "@/lib/reportService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
   Card,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";

type Item = {
   id: string;
   name: string;
   attachments: string[];
};

export default function Profile() {
   const [items, setItems] = useState<{
      lostItems: Item[];
      foundItems: Item[];
   }>({
      lostItems: [],
      foundItems: [],
   });
   const { user } = useAuth();

   useEffect(() => {
      const getUsers = async () =>
         await Promise.all([getUserFoundItems(), getUserLostItems()]);
      const fetchUsers = async () => {
         const [[found], [lost]] = await getUsers();

         setItems({ foundItems: found.foundItems, lostItems: lost.lostItems });
      };

      fetchUsers();
   }, []);

   return (
      <div className="w-screen h-max">
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
                  <TabsList className="w-75 lg:w-100 h-auto bg-primary-foreground border shadow-inner p-1">
                     <TabsTrigger
                        className="text-xs lg:text-base cursor-pointer p-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                        value="foundItems">
                        Found Items
                     </TabsTrigger>
                     <TabsTrigger
                        className="text-xs lg:text-base cursor-pointer p-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                        value="lostItems">
                        Lost Items
                     </TabsTrigger>
                  </TabsList>
               </div>
               <div className="my-10 mt-10 bg-transparent px-0 rounded-md flex">
                  <TabsContent className="flex flex-wrap justify-center gap-5" value="foundItems">
                     {items.foundItems.map((item) => (
                        <Card
                           key={item.id}
                           className="w-28 lg:w-70 p-0 flex gap-0 bg-transparent overflow-hidden border rounded-sm shadow-none hover:shadow-lg hover:border-transparent transition-all duration-100 ease-linear">
                           <CardHeader className="bg-primary-foreground p-0 lg:p-5 gap-0 lg:shadow-inner lg:border-b relative">
                              <CardTitle>
                                 <img
                                    className="aspect-video h-30 lg:h-50 object-cover lg:object-contain object-center lg:object-top lg:drop-shadow-lg lg:drop-shadow-black/50 z-10"
                                    src={
                                       item?.attachments?.length > 0
                                          ? item.attachments[0]
                                          : undefined
                                    }
                                    alt="image"
                                 />
                              </CardTitle>
                           </CardHeader>
                           <CardDescription className="p-3 lg:p-5 text-xs font-medium lg:text-lg text-primary flex flex-col">
                              {item.name}
                           </CardDescription>
                        </Card>
                     ))}
                  </TabsContent>
                  <TabsContent className="flex flex-wrap justify-center gap-5" value="lostItems">
                     {items.lostItems.map((item) => (
                        <Card
                           key={item.id}
                           className="w-28 lg:w-70 p-0 flex gap-0 bg-transparent overflow-hidden border rounded-sm shadow-none hover:shadow-lg hover:border-transparent transition-all duration-100 ease-linear">
                           <CardHeader className="bg-primary-foreground p-0 lg:p-5 gap-0 lg:shadow-inner lg:border-b relative">
                              <CardTitle>
                                 <img
                                    className="aspect-video h-30 lg:h-50 object-cover lg:object-contain object-center lg:object-top lg:drop-shadow-lg lg:drop-shadow-black/50 z-10"
                                    src={
                                       item?.attachments?.length > 0
                                          ? item.attachments[0]
                                          : undefined
                                    }
                                    alt="image"
                                 />
                              </CardTitle>
                           </CardHeader>
                           <CardDescription className="p-3 lg:p-5 text-xs font-medium lg:text-lg text-primary flex flex-col">
                              {item.name}
                           </CardDescription>
                        </Card>
                     ))}
                  </TabsContent>
               </div>
            </Tabs>
         </div>
      </div>
   );
}
