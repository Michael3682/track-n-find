"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getItems } from "@/lib/reportService";
import { Button } from "@/components/ui/button";
import { Mail, Pin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NavigationBar } from "@/components/navigationbar";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
} from "@/components/ui/card";
import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
   SheetFooter,
} from "@/components/ui/sheet";

type Item = {
   id: string;
   name: string;
   description: string;
   category: string;
   date_time: string;
   location: string;
   attachments: string[];
   status: "CLAIMED" | "UNCLAIMED";
   type: "FOUND" | "LOST";
   associated_person: string;
};

export default function Homepage() {
   const [items, setItems] = useState<Item[]>([]);

   const foundItems = items
      .filter((item) => item.type.toLowerCase() === "found")
      .sort((a, b) => {
         return (
            new Date(b.date_time).getTime() - new Date(a.date_time).getTime()
         );
      })
      .slice(0, 5);

   const lostItems = items
      .filter((item) => item.type.toLowerCase() === "lost")
      .sort((a, b) => {
         return (
            new Date(b.date_time).getTime() - new Date(a.date_time).getTime()
         );
      })
      .slice(0, 5);

   const formattedDate = (date: string) => {
      return new Date(date).toLocaleDateString("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
         hour: "numeric",
         minute: "2-digit",
      });
   };

   useEffect(() => {
      getItems().then(([data]) => setItems(data.items));
   }, []);

   return (
      <div className="w-auto h-auto bg-[rgb(245,245,245)] relative">
         <NavigationBar />
         <div className="h-screen px-20 flex justify-start items-center relative">
            <div className="w-full h-full flex flex-col justify-center items-center gap-3 z-10">
               <h1 className="w-max text-6xl font-bold text-center text-[rgb(245,245,245)]">
                  Help Your School Community Find What’s Lost
               </h1>
               <p className="text-lg text-center w-3xl font-normal text-balance text-[rgb(200,200,200)]">
                  Easily report, search, and reunite lost items in your school
               </p>
               <Button className="mt-3 p-5 rounded-md bg-blue-500 cursor-pointer hover:bg-blue-600">
                  <Link className="text-base" href="/browse">
                     Start Searching
                  </Link>
               </Button>
            </div>
            <video
               autoPlay
               muted
               loop
               playsInline
               className="absolute inset-0 w-full h-full object-cover filter brightness-20 z-0">
               <source src="/videos/background.mp4" type="video/mp4" />
            </video>
         </div>
         <div className="w-full h-full px-50 py-20 flex flex-col gap-20">
            <div>
               <h1 className="text-4xl font-normal text-start text-[rgb(20,20,20)]">
                  Recent Found Items
               </h1>
               <div className="h-full w-full flex gap-5 mt-10">
                  {foundItems.map((item) => (
                     <Sheet key={item.id}>
                        <SheetTrigger className="cursor-pointer p-0" asChild>
                           <Card className="w-70 bg-transparent overflow-hidden border rounded-sm shadow-none hover:shadow-lg hover:border-transparent transition-all duration-100 ease-linear">
                              <CardHeader className="bg-primary-foreground p-5 shadow-inner border-b relative">
                                 <CardTitle>
                                    <img
                                       className="aspect-video h-50 object-contain object-top drop-shadow-lg drop-shadow-black/50 z-10"
                                       src={
                                          item?.attachments?.length > 0
                                             ? item.attachments[0]
                                             : undefined
                                       }
                                       alt="image"
                                    />
                                    <Badge
                                       className={`${
                                          item.status === "CLAIMED"
                                             ? "bg-green-400"
                                             : "bg-red-400"
                                       } z-50 absolute top-0 right-0 rounded-tl-none rounded-tr-sm rounded-bl-md rounded-br-none`}>
                                       <small>{item.status}</small>
                                    </Badge>
                                 </CardTitle>
                              </CardHeader>
                              <CardDescription className="p-5 pt-0 text-xl text-[rgb(20,20,20)] flex flex-col">
                                 {item.name}
                                 <small className="text-xs font-light text-muted-foreground">
                                    {item.type}
                                 </small>
                              </CardDescription>
                           </Card>
                        </SheetTrigger>
                        <SheetContent side="center">
                           <SheetHeader className="space-y-5">
                              <img
                                 className="aspect-video object-contain object-top shadow-inner shadow-black/10 rounded-md p-5 drop-shadow-lg drop-shadow-black/50"
                                 src={
                                    item?.attachments?.length > 0
                                       ? item.attachments[0]
                                       : undefined
                                 }
                                 alt="image"
                              />
                              <div className="space-y-5">
                                 <SheetTitle className="text-3xl">
                                    {item.name}
                                    <p className="text-xs font-light text-muted-foreground">
                                       Reported By:{" "}
                                       <span className="font-normal">
                                          {item.associated_person}
                                       </span>
                                    </p>
                                 </SheetTitle>
                                 <div className="space-y-7">
                                    <p className="text-lg text-muted-foreground">
                                       {item.description}
                                    </p>
                                    <Separator />
                                    <div className="space-y-2">
                                       <p className="mt-5 text-base font-medium text-[rgb(20,20,20)] flex justify-between">
                                          Reported on:{" "}
                                          <span className="font-normal">
                                             {formattedDate(item.date_time)}
                                          </span>
                                       </p>
                                       <p className="text-base font-medium text-[rgb(20,20,20)]  flex justify-between">
                                          Location:{" "}
                                          <span className="font-normal">
                                             {item.location}
                                          </span>
                                       </p>
                                       <p className="text-base font-medium text-[rgb(20,20,20)]  flex justify-between">
                                          Status:{" "}
                                          <span className="font-semibold text-red-500">
                                             {item.status}
                                          </span>
                                       </p>
                                    </div>
                                 </div>
                              </div>
                           </SheetHeader>
                           <SheetFooter>
                              <Button
                                 className="cursor-pointer"
                                 type="submit"
                                 asChild>
                                 <Link href={`messages/${item.id}`}>
                                    Message User
                                 </Link>
                              </Button>
                           </SheetFooter>
                        </SheetContent>
                     </Sheet>
                  ))}
               </div>
            </div>
            <Separator />
            <div>
               <h1 className="text-4xl font-normal text-start text-[rgb(20,20,20)]">
                  Recent Lost Items
               </h1>
               <div className="h-full w-full flex gap-5 mt-10">
                  {lostItems.map((item) => (
                     <Sheet key={item.id}>
                        <SheetTrigger className="cursor-pointer p-0" asChild>
                           <Card className="w-70 bg-transparent overflow-hidden border rounded-sm shadow-none hover:shadow-lg hover:border-transparent transition-all duration-100 ease-linear">
                              <CardHeader className="bg-primary-foreground p-5 shadow-inner border-b relative">
                                 <CardTitle>
                                    <img
                                       className="aspect-video h-50 object-contain object-top drop-shadow-lg drop-shadow-black/50 z-10"
                                       src={
                                          item?.attachments?.length > 0
                                             ? item.attachments[0]
                                             : undefined
                                       }
                                       alt="image"
                                    />
                                    <Badge
                                       className={`${
                                          item.status === "CLAIMED"
                                             ? "bg-green-400"
                                             : "bg-red-400"
                                       } z-50 absolute top-0 right-0 rounded-tl-none rounded-tr-sm rounded-bl-md rounded-br-none`}>
                                       <small>{item.status}</small>
                                    </Badge>
                                 </CardTitle>
                              </CardHeader>
                              <CardDescription className="p-5 pt-0 text-xl text-[rgb(20,20,20)] flex flex-col">
                                 {item.name}
                                 <small className="text-xs font-light text-muted-foreground">
                                    {item.type}
                                 </small>
                              </CardDescription>
                           </Card>
                        </SheetTrigger>
                        <SheetContent side="center">
                           <SheetHeader className="space-y-5">
                              <img
                                 className="aspect-video object-contain object-top shadow-inner shadow-black/10 rounded-md p-5 drop-shadow-lg drop-shadow-black/50"
                                 src={
                                    item?.attachments?.length > 0
                                       ? item.attachments[0]
                                       : undefined
                                 }
                                 alt="image"
                              />
                              <div className="space-y-5">
                                 <SheetTitle className="text-3xl">
                                    {item.name}
                                    <p className="text-xs font-light text-muted-foreground">
                                       Reported By:{" "}
                                       <span className="font-normal">
                                          {item.associated_person}
                                       </span>
                                    </p>
                                 </SheetTitle>
                                 <div className="space-y-7">
                                    <p className="text-lg text-muted-foreground">
                                       {item.description}
                                    </p>
                                    <Separator />
                                    <div className="space-y-2">
                                       <p className="mt-5 text-base font-medium text-[rgb(20,20,20)] flex justify-between">
                                          Reported on:{" "}
                                          <span className="font-normal">
                                             {formattedDate(item.date_time)}
                                          </span>
                                       </p>
                                       <p className="text-base font-medium text-[rgb(20,20,20)]  flex justify-between">
                                          Location:{" "}
                                          <span className="font-normal">
                                             {item.location}
                                          </span>
                                       </p>
                                       <p className="text-base font-medium text-[rgb(20,20,20)]  flex justify-between">
                                          Status:{" "}
                                          <span className="font-semibold text-red-500">
                                             {item.status}
                                          </span>
                                       </p>
                                    </div>
                                 </div>
                              </div>
                           </SheetHeader>
                           <SheetFooter>
                              <Button
                                 className="cursor-pointer"
                                 type="submit"
                                 asChild>
                                 <Link href={`messages/${item.id}`}>
                                    Message User
                                 </Link>
                              </Button>
                           </SheetFooter>
                        </SheetContent>
                     </Sheet>
                  ))}
               </div>
            </div>
         </div>
         <footer className="bg-[rgb(20,20,20)] px-50 py-10">
            <div className="w-full flex justify-between">
               <div className="w-1/2 flex flex-col gap-8">
                  <h1 className="text-5xl font-bold text-start text-white">
                     TrackNFind
                  </h1>
                  <p className="text-lg font-semibold text-[rgb(200,200,200)] text-balance">
                     TrackNFind is a community-driven platform connecting people
                     who have lost belongings with those who have found them.
                     Together, we make recovery faster, easier, and more
                     efficient for everyone.
                  </p>
               </div>
               <div className="w-1/2 flex flex-col justify-end items-end">
                  <div className="flex flex-col gap-5">
                     <small className="text-[rgb(175,175,175)] text-sm leading-none font-medium flex gap-2">
                        <Mail size={20} />
                        support@tracknfind.com
                     </small>
                     <small className="text-[rgb(175,175,175)] text-sm leading-none font-medium flex gap-2">
                        <Pin size={20} />
                        123 Community St, Tech City, TC 12345
                     </small>
                     <small className="text-[rgb(175,175,175)] text-sm leading-none font-medium flex gap-2">
                        <Phone size={20} />
                        1-800-TRACK-IT (1-800-872-2548)
                     </small>
                  </div>
               </div>
            </div>
            <Separator className="bg-white/20 my-10" />
            <div className="flex justify-between">
               <p className="text-base font-semibold text-[rgb(200,200,200)] text-balance">
                  @ 2025 TrackNFind Inc. All rights reserved. Helping
                  communities reconnect with their belongings since 2025.
               </p>
               <div className="flex gap-10">
                  <img
                     className="h-8 cursor-pointer"
                     src="track-n-find--logo.png"
                     alt="logo"
                  />
                  <img
                     className="h-8 cursor-pointer"
                     src="logos_facebook.png"
                     alt="logo"
                  />
                  <img
                     className="h-8 cursor-pointer"
                     src="logos_instagram.png"
                     alt="logo"
                  />
                  <img
                     className="h-8 cursor-pointer"
                     src="logos_discord.png"
                     alt="logo"
                  />
               </div>
            </div>
         </footer>
      </div>
   );
}
