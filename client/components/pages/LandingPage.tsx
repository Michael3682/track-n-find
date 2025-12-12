"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";

export default function LandingPage() {
   const router = useRouter();

   return (
      <div className="w-auto h-auto flex flex-col">
         <div className="h-screen flex flex-col items-center justify-center gap-5 relative">
            <img
               className="w-screen h-screen absolute top-0 left-0 object-cover brightness-20 z-0 pointer-events-none"
               src="landing-page--hero-section---background.jpg"
               alt=""
            />
            <div className="h-fit flex items-center justify-center gap-2 py-3 lg:py-5 absolute top-0 z-50">
               <img
                  className="h-7 lg:h-8"
                  src="/logo.svg"
                  alt="log"
               />
               <h1 className="text-white text-lg lg:text-2xl font-medium tracking-tight">
                  TrackNFind
               </h1>
            </div>
            <div className="w-full h-screen flex flex-col items-center lg:items-start justify-center px-8 lg:px-32 gap-3 lg:gap-5 z-10">
               <h1 className="text-center lg:text-start font-extrabold tracking-tight text-[rgb(245,245,245)] text-4xl lg:text-7xl text-balance">
                  Track What’s Lost,
                  <br />
                  Find What’s Found.
               </h1>
               <small className="text-sm text-center lg:text-start lg:text-xl font-medium text-[rgb(245,245,245)] text-balance">
                  Join TrackNFind to connect with others and track down lost
                  items quickly.
                  <br className="hidden lg:block" />
                  Lost something? Or found something? Let the community know!
               </small>
               <Button
                  className="mt-3 bg-blue-700 hover:bg-blue-600 lg:text-base text-[rgb(245,245,245)] lg:p-5 cursor-pointer"
                  onClick={() => router.push("/login")}>
                  Get Started
               </Button>
            </div>
         </div>
         <div className="w-full h-1/2 px-8 lg:px-32 py-15 lg:py-30 bg-[rgb(230,230,230)]">
            <h1 className="text-center text-3xl lg:text-4xl font-extrabold text-primary tracking-tight mb-15">
               Why Use TrackNFind?
            </h1>
            <div className="flex flex-row flex-wrap lg:flex-nowrap justify-center gap-8 lg:gap-10">
               <Card className="p-8">
                  <CardHeader className="p-0">
                     <CardTitle>Report a Lost Item</CardTitle>
                  </CardHeader>
                  <CardDescription>
                     Easily report items you've lost, and track them through our
                     secure platform.
                  </CardDescription>
               </Card>
               <Card className="p-8">
                  <CardHeader className="p-0">
                     <CardTitle>Browse Found Item</CardTitle>
                  </CardHeader>
                  <CardDescription>
                     Browse through recently found items that others have
                     reported, and claim yours.
                  </CardDescription>
               </Card>
               <Card className="p-8">
                  <CardHeader className="p-0">
                     <CardTitle>Centralized Tracking</CardTitle>
                  </CardHeader>
                  <CardDescription>
                     Track all your lost and found items in one place with
                     real-time updates.
                  </CardDescription>
               </Card>
            </div>
         </div>
         <footer className="bg-primary p-8 lg:px-32 lg:py-10">
            <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-8">
               <h1 className="text-5xl lg:text-6xl text-[rgb(245,245,245)] font-bold">
                  TrackNFind
               </h1>
               <div className="flex gap-4 lg:gap-5 text-muted-foreground">
                  <Link href="/about">About</Link>
                  <Link href="/contact">Contact</Link>
                  <Link href="/terms">Terms</Link>
                  <Link href="/privacy">Privacy</Link>
               </div>
            </div>
            <hr className="my-7 lg:my-10 border-white/10" />
            <div className="mt-10 text-center text-muted-foreground text-sm">
               <p>© 2025 TrackNFind. All rights reserved.</p>
            </div>
         </footer>
      </div>
   );
}
