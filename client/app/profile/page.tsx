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

export default function Profile() {
   const clones = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
   }));


   return (
      <div className="w-auto h-max bg-[rgb(245,245,245)]">
         <NavigationBar />
         <div className="w-full h-100 relative flex items-center">
            <img
               className="absolute top-0 h-1/2 w-full object-cover object-bottom z-0"
               src="https://imgs.search.brave.com/Beqi5bF2_fwfT7rQMUy6BlKvbb0wS90TCr9OA3Fl1lI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDYyOTc5/ODIuanBn"
               alt="profile background"
            />
            <div className="w-full flex items-end gap-5 p-10">
               <Avatar className="content-end w-max h-50 border-5 border-white">
                  <AvatarImage
                     src="https://github.com/shadcn.png"
                     alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
               <h1 className="text-4xl font-extrabold tracking-tight z-10 mb-10">
                  User Name
               </h1>
            </div>
         </div>
         <div className="w-full">
            <Tabs defaultValue="foundItems" className="w-full">
               <div className="px-10 w-full flex justify-center">
                  <TabsList className="w-100 bg-black/10">
                     <TabsTrigger className="cursor-pointer" value="foundItems">
                        Found Items
                     </TabsTrigger>
                     <TabsTrigger className="cursor-pointer" value="lostItems">
                        Lost Items
                     </TabsTrigger>
                  </TabsList>
               </div>
               <div className="mx-10 my-10 mt-10 bg-black/10 p-5 rounded-md">
                  <TabsContent value="foundItems">
                     <div className="flex flex-wrap gap-5">
                        {clones.map((item) => (
                           <Card
                              key={item.id}
                              className="w-70 grow pt-0 overflow-hidden border border-black/30 rounded-sm shadow-sm hover:shadow-lg hover:border-transparent transition-all duration-100 ease-linear">
                              <CardHeader className="bg-primary-foreground p-5">
                                 <CardTitle className="flex justify-center">
                                    <img
                                       className="invert aspect-video h-50"
                                       src="vercel.svg"
                                       alt="image"
                                    />
                                 </CardTitle>
                              </CardHeader>
                              <CardDescription className="p-5 pt-0 text-xl text-[rgb(20,20,20)]">
                                 Item Name
                              </CardDescription>
                           </Card>
                        ))}
                     </div>
                  </TabsContent>
                  <TabsContent
                     className="flex flex-wrap gap-5"
                     value="lostItems">
                     {clones.map((item) => (
                        <Card
                           key={item.id}
                           className="w-70 grow pt-0 overflow-hidden border border-black/30 rounded-sm shadow-sm hover:shadow-lg hover:border-transparent transition-all duration-100 ease-linear">
                           <CardHeader className="bg-primary-foreground p-5">
                              <CardTitle>
                                 <img
                                    className="invert aspect-video h-50"
                                    src="file.svg"
                                    alt="image"
                                 />
                              </CardTitle>
                           </CardHeader>
                           <CardDescription className="p-5 pt-0 text-xl text-[rgb(20,20,20)]">
                              Item Name
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
