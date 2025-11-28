"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Pin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NavigationBar } from "@/components/navigationbar";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardAction,
} from "@/components/ui/card";

export default function Homepage() {
   const clones = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      url: "/",
   }));

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
                  {clones.map((item) => (
                     <Card
                        key={item.id}
                        className="w-70 bg-transparent overflow-hidden border rounded-sm shadow-none hover:shadow-lg hover:border-transparent transition-all duration-100 ease-linear">
                        <CardHeader>
                           <CardTitle>
                              <img
                                 className="invert"
                                 src="vercel.svg"
                                 alt="image"
                              />
                           </CardTitle>
                        </CardHeader>
                        <CardDescription className="px-5 text-2xl text-[rgb(20,20,20)]">
                           {item.name}
                        </CardDescription>
                        <CardAction className="px-5">
                           <Button className="bg-blue-500 rounded-md hover:bg-blue-600 cursor-pointer">
                              <Link href={item.url}>View Details</Link>
                           </Button>
                        </CardAction>
                     </Card>
                  ))}
               </div>
            </div>
            <Separator className="bg-black/20" />
            <div>
               <h1 className="text-4xl font-normal text-start text-[rgb(20,20,20)]">
                  Recent Lost Items
               </h1>
               <div className="h-full w-full flex justify-between gap-5 mt-10">
                  {clones.map((item) => (
                     <Card
                        key={item.id}
                        className="w-70 bg-transparent overflow-hidden border rounded-sm shadow-none hover:shadow-lg hover:border-transparent transition-all duration-100 ease-linear">
                        <CardHeader>
                           <CardTitle>
                              <img
                                 className="invert"
                                 src="vercel.svg"
                                 alt="image"
                              />
                           </CardTitle>
                        </CardHeader>
                        <CardDescription className="px-5 text-2xl text-[rgb(20,20,20)]">
                           {item.name}
                        </CardDescription>
                        <CardAction className="px-5">
                           <Button className="bg-blue-500 rounded-md hover:bg-blue-600 cursor-pointer">
                              <Link href={item.url}>View Details</Link>
                           </Button>
                        </CardAction>
                     </Card>
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
                  <div className="flex flex-col gap-2">
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
               <div className="flex gap-5">
                  <img className="h-8" src="vercel.svg" alt="logo" />
                  <img className="h-8" src="vercel.svg" alt="logo" />
                  <img className="h-8" src="vercel.svg" alt="logo" />
                  <img className="h-8" src="vercel.svg" alt="logo" />
               </div>
            </div>
         </footer>
      </div>
   );
}
