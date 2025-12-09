"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NavigationBar } from "@/components/navigationbar";
import { HomepageCardSheet } from "@/components/homepage-card-sheet";
import { Footer } from "@/components/footer";

export default function Homepage() {
   const router = useRouter();

   return (
      <div className="w-auto h-auto bg-[rgb(245,245,245)] relative">
         <NavigationBar />
         <div className="h-screen w-full px-8 flex justify-start items-center relative">
            <div className="w-full h-screen flex flex-col items-center justify-center gap-3 lg:gap-5 z-10">
               <h1 className="text-center font-extrabold tracking-tight text-[rgb(229,229,229)] text-4xl lg:text-7xl text-balance">
                  Help Community Find What’s Lost
               </h1>
               <small className="text-sm text-center lg:text-start lg:text-xl font-medium text-[rgb(229,229,229)] text-balance">
                  Easily report, search, and reunite lost items in your school
               </small>
               <Button
                  className="mt-5 bg-blue-700 hover:bg-blue-600 text-[rgb(229,229,229)] lg:text-base lg:p-5 cursor-pointer"
                  onClick={() => router.push("/browse")}>
                  Start Searching
               </Button>
            </div>
            <video
               autoPlay
               muted
               loop
               playsInline
               className="absolute inset-0 w-screen h-full object-cover filter brightness-25 z-0">
               <source src="/videos/background.mp4" type="video/mp4" />
            </video>
         </div>
         <HomepageCardSheet />
         <Footer />
      </div>
   );
}
