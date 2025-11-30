"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Image, SendHorizontal } from "lucide-react";
import { SearchForm } from "@/components/search-form";
import { NavigationBar } from "@/components/navigationbar";
import { Card, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Messages() {
   const [searchItem, setSearchItem] = useState("");

   const items = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      description:
         "A black leather business bag was turned in to our office earlier today. The bag features a structured rectangular design with silver-toned hardware and a reinforced handle.",
   }));

   const filteredItems = items.filter((item) =>
      item.name.toLowerCase().includes(searchItem.toLowerCase())
   );

   return (
      <div className="w-auto h-screen relative overflow-hidden">
         <NavigationBar className="fixed" />
         <div className="w-full h-full flex pt-12.5">
            <div className="w-100 h-full px-3 pt-5 border-r border-r-black/15 relative space-y-5">
               <header className="space-y-3 w-full sticky">
                  <h1 className="font-bold text-3xl px-2">Chats</h1>
                  <SearchForm
                     className="p-0 w-full"
                     value={searchItem}
                     onChange={(e) =>
                        setSearchItem((e.target as HTMLInputElement).value)
                     }
                  />
               </header>
               <div className="w-full h-screen overflow-y-auto">
                  {filteredItems.map((item) => (
                     <Card
                        key={item.id}
                        className="w-full h-max bg-transparent overflow-hidden rounded-md flex flex-row gap-2 px-3 py-3 shadow-none border-none hover:bg-black/3 cursor-pointer">
                        <Avatar className="w-auto h-13">
                           <AvatarImage
                              src="https://github.com/shadcn.png"
                              alt="@shadcn"
                           />
                           <AvatarFallback>img</AvatarFallback>
                        </Avatar>
                        <CardDescription className="w-full pr-2">
                           <p className="text-base font-medium text-[rgb(20,20,20)] overflow-hidden">
                              {item.name}
                           </p>
                           <div className="w-55 text-sm text-ellipsis whitespace-nowrap overflow-hidden">
                              {item.description}
                           </div>
                        </CardDescription>
                     </Card>
                  ))}
               </div>
            </div>
            <div className="w-full h-full p-3">
               <div className="w-full h-full rounded-md border border-black/20 shadow-md shadow-black/50 overflow-hidden bg-[rgb(245,245,245)] relative flex flex-col">
                  <div className="w-full p-2 px-3 flex items-center gap-2 bg-white border-b border-b-black/10 sticky">
                     <Avatar className="w-max h-8">
                        <AvatarImage
                           src="https://github.com/shadcn.png"
                           alt="@shadcn"
                        />
                        <AvatarFallback>img</AvatarFallback>
                     </Avatar>
                     <small className="text-sm leading-none font-medium">
                        User Name
                     </small>
                  </div>
                  <div className="w-full h-full bg-white"></div>
                  <div className="flex items-center px-3 p-2 gap-3 border-t bg-white">
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <div className="p-2 rounded-full bg-blue-500 cursor-pointer">
                              <Image color="rgb(245,245,245)" size={18} />
                           </div>
                        </TooltipTrigger>
                        <TooltipContent>
                           <p>Attach a file</p>
                        </TooltipContent>
                     </Tooltip>
                     <Input
                        className="border border-black/30 rounded-full focus-visible:ring-0"
                        placeholder="Type Here..."
                     />
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <div className="p-2 rounded-full bg-blue-500 cursor-pointer">
                              <SendHorizontal
                                 color="rgb(245,245,245)"
                                 size={18}
                              />
                           </div>
                        </TooltipTrigger>
                        <TooltipContent>
                           <p>Submit</p>
                        </TooltipContent>
                     </Tooltip>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
