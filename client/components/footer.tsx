import { Mail, Pin, Phone } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";

export function Footer() {
   const isMobile = useIsMobile();
   return (
      <footer className="bg-primary px-8 lg:px-32 py-10">
         <div className="w-full flex flex-col lg:flex-row items-center lg:items-end gap-10 lg:gap-0">
            <div className="lg:w-1/2 flex flex-col gap-8">
               <h1 className="text-4xl lg:text-5xl font-bold text-center lg:text-start text-secondary">
                  TrackNFind
               </h1>
               <small className="text-sm lg:text-lg font-medium text-secondary text-center lg:text-start text-balance">
                  TrackNFind is a community-driven platform connecting people
                  who have lost belongings with those who have found them.
                  Together, we make recovery faster, easier, and more
                  efficient for everyone.
               </small>
            </div>
            <div className="w-max lg:w-1/2 flex lg:justify-end">
               <div className="w-max flex flex-col gap-5">
                  <small className="text-muted-foreground text-xs lg:text-sm leading-none font-medium flex gap-3">
                     <Mail size={isMobile ? 16 : 20} />
                     support@tracknfind.com
                  </small>
                  <small className="text-muted-foreground text-xs lg:text-sm leading-none font-medium flex gap-3">
                     <Pin size={isMobile ? 16 : 20} />
                     123 Community St, Tech City, TC 12345
                  </small>
                  <small className="text-muted-foreground text-xs lg:text-sm leading-none font-medium flex gap-3">
                     <Phone size={isMobile ? 16 : 20} />
                     1-800-TRACK-IT (1-800-872-2548)
                  </small>
               </div>
            </div>
         </div>
         <Separator className="bg-muted-foreground my-10" />
         <div className="flex justify-between flex-wrap-reverse lg:flex-nowrap gap-10 lg:gap-0">
            <p className="text-xs lg:text-sm text-center lg:text-start text-secondary">
               @ 2025 TrackNFind Inc. All rights reserved. Helping
               communities reconnect with their belongings since 2025.
            </p>
            <div className="w-full lg:w-max flex justify-evenly lg:gap-10">
               <img
                  className="h-7 w-7 object-contain lg:h-8 cursor-pointer"
                  src="track-n-find--logo.png"
                  alt="logo"
               />
               <img
                  className="h-7 w-7 object-contain lg:h-8 cursor-pointer"
                  src="logos_facebook.png"
                  alt="logo"
               />
               <img
                  className="h-7 w-7 object-contain lg:h-8 cursor-pointer"
                  src="logos_instagram.png"
                  alt="logo"
               />
               <img
                  className="h-7 w-7 object-contain lg:h-8 cursor-pointer"
                  src="logos_discord.png"
                  alt="logo"
               />
            </div>
         </div>
      </footer>
   )
}