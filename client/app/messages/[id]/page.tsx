"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Image, SendHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getSocket } from "@/lib/socket";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/auth/AuthContext";
import { getItem } from "@/lib/reportService";
import { Item } from "@/components/card-sheet";

export default function Messages() {
  const [item, setItem] = useState<Item>();
  const { id: itemId } = useParams();
  const { user } = useAuth();
  const socket = getSocket();

  const send = () => {
    console.log("sending");
    socket.emit("send_message", {
      roomId: "global",
      text: "Hello World",
    });
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("new_message", (msg) => {
      // setMessages((prev) => [...prev, msg.text]);
      console.log(msg);
    });

    return () => {
      socket.off("new_message");
    };
  }, []);

  useEffect(() => {
   if(!user?.id || !item?.associated_person) return

    socket.emit("new_conversation", {
      itemId,
      hostId: item?.associated_person,
      senderId: user?.id,
    });
    console.log("emitted")
  }, [user, item]);

  useEffect(() => {
    getItem(String(itemId)).then(([data]) => setItem(data.item));
  }, []);

  
  return (
    <div className="w-full h-full p-3">
      <div className="w-full h-full rounded-md border border-black/20 shadow-md shadow-black/50 overflow-hidden bg-[rgb(245,245,245)] relative flex flex-col">
        <div className="w-full p-2 px-3 flex items-center gap-2 bg-white border-b border-b-black/10 sticky">
          <Avatar className="w-max h-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>img</AvatarFallback>
          </Avatar>
          <small className="text-sm leading-none font-medium">User Name</small>
        </div>
        <div className="w-full h-full bg-white"></div>
        <div className="flex items-center px-3 p-2 gap-3 border-t bg-white">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="p-2 rounded-full bg-blue-600 cursor-pointer">
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
            <TooltipTrigger asChild onClick={() => send()}>
              <div className="p-2 rounded-full bg-blue-600 cursor-pointer">
                <SendHorizontal color="rgb(245,245,245)" size={18} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send Message</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
