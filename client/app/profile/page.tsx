"use client";

import { NavigationBar } from "@/components/navigationbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
   Card,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useEffect, useState } from "react";
import { getUserFoundItems, getUserLostItems } from "@/lib/reportService";

type Item = {
   id: string,
   name: string,
   attachments: string[]
}

export default function Profile() {
   const [items, setItems] = useState<{lostItems: Item[], foundItems: Item[]}>({
      lostItems: [],
      foundItems: []
   })
   const { user } = useAuth()

   useEffect(() => {
      const getUsers = async () => await Promise.all([getUserFoundItems(), getUserLostItems()])
      const fetchUsers = async () =>{
         const [[found], [lost]] = await getUsers()

         setItems({ foundItems: found.foundItems, lostItems: lost.lostItems })
      } 

     fetchUsers()
   }, [])

   return (
      <div className="w-auto h-max bg-[rgb(245,245,245)]">
         <NavigationBar />
         <div className="w-full h-100 relative flex items-center mb-5">
            <img
               className="absolute top-0 h-1/2 w-full object-cover object-bottom z-0"
               src="https://imgs.search.brave.com/Beqi5bF2_fwfT7rQMUy6BlKvbb0wS90TCr9OA3Fl1lI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDYyOTc5/ODIuanBn"
               alt="profile background"
            />
            <div className="w-full flex items-end gap-5 px-50">
               <Avatar className="content-end w-max h-50 border-5 border-white">
                  <AvatarImage
                     src="https://github.com/shadcn.png"
                     alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
               <h1 className="text-4xl font-extrabold tracking-tight z-10 mb-10">
                  {user?.name}
               </h1>
            </div>
         </div>
         <div className="w-full flex justify-center">
            <Tabs defaultValue="foundItems">
               <div className="px-10 w-full flex justify-center">
                  <TabsList className="w-100 h-auto bg-transparent border shadow-inner p-1">
                     <TabsTrigger
                        className="cursor-pointer p-2"
                        value="foundItems">
                        Found Items
                     </TabsTrigger>
                     <TabsTrigger
                        className="cursor-pointer p-2"
                        value="lostItems">
                        Lost Items
                     </TabsTrigger>
                  </TabsList>
               </div>
               <div className="mx-50 my-10 mt-10 bg-transparent p-5 rounded-md">
                  <TabsContent value="foundItems">
                     <div className="flex flex-wrap gap-5">
                        {items.foundItems.map((item) => (
                           <Card
                              key={item?.id}
                              className="w-70 grow pt-0 overflow-hidden border border-black/30 rounded-sm shadow-sm hover:shadow-lg hover:border-transparent transition-all duration-100 ease-linear">
                              <CardHeader className="bg-primary-foreground p-5">
                                 <CardTitle className="flex justify-center">
                                    <img
                                       className="invert aspect-video h-50"
                                       src={item?.attachments?.length > 0 ? item.attachments[0] : undefined}
                                       alt="image"
                                    />
                                 </CardTitle>
                              </CardHeader>
                              <CardDescription className="p-5 pt-0 text-xl text-[rgb(20,20,20)]">
                                 {item.name}
                              </CardDescription>
                           </Card>
                        ))}
                     </div>
                  </TabsContent>
                  <TabsContent
                     className="flex flex-wrap gap-5"
                     value="lostItems">
                     {items.lostItems.map((item) => (
                        <Card
                           key={item?.id}
                           className="w-70 grow pt-0 overflow-hidden border border-black/30 rounded-sm shadow-sm hover:shadow-lg hover:border-transparent transition-all duration-100 ease-linear">
                           <CardHeader className="bg-primary-foreground p-5">
                              <CardTitle className="flex justify-center">
                                 <img
                                    className="invert aspect-video h-50"
                                    src={item?.attachments?.length > 0 ? item.attachments[0] : undefined}
                                    alt="image"
                                 />
                              </CardTitle>
                           </CardHeader>
                           <CardDescription className="p-5 pt-0 text-xl text-[rgb(20,20,20)]">
                              {item?.name}
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
