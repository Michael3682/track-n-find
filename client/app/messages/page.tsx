"use client";

import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const page = () => {
   const isMobile = useIsMobile();
   return (
      <div
         className={`h-full w-full justify-center items-center text-gray-400 text-md ${
            isMobile ? "hidden" : "flex"
         }`}>
         No Messages here
      </div>
   );
};

export default page;
