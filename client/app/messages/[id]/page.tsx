"use client";

import { getSocket } from "@/lib/socket";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { getConversation } from "@/lib/chatService";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Conversation, Message } from "@/types/types";
import { useMessage } from "@/contexts/messages/MessageContext";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Image, SendHorizontal, ArrowLeft, Ellipsis } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import { toggleItemStatus } from "@/lib/reportService";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Messages() {
   const isMobile = useIsMobile();
   const router = useRouter();
   const [convo, setConvo] = useState<Conversation>();
   const { showMessage, setShowMessage } = useMessage();
   const [messages, setMessages] = useState<Message[]>([]);
   const [tempMessage, setTempMessage] = useState<string[]>([]);
   const messagesRef = useRef<HTMLDivElement>(null);

   const [chatDetails, setChatDetails] = useState<{
      text: string;
      attachment: File[];
      previewURL: string[];
   }>({
      text: "",
      attachment: [],
      previewURL: [],
   });
   const { id: conversationId } = useParams();
   const { socket, user } = useAuth();

   const send = (e: FormEvent) => {
      e.preventDefault();

      if (chatDetails.text.trim() == "") return;

      socket?.emit("send_message", {
         text: chatDetails.text,
         conversationId,
         recepientId: convo?.isMine ? convo?.senderId : convo?.hostId,
         senderId: ["MODERATOR", "ADMIN"].includes(user?.role as string)
            ? user?.id
            : convo?.isMine
            ? convo?.hostId
            : convo?.senderId,
      });

      setTempMessage((prev) => [...prev, chatDetails.text]);
      setChatDetails((prev) => ({
         ...prev,
         text: "",
         attachment: [],
         previewURL: [],
      }));
   };

   const fetchConversation = async () => {
      const [data] = await getConversation(String(conversationId));
      setConvo(data.conversation);
   };

   const handleToggleItemStatus = async () => {
      const [data] = await toggleItemStatus(convo?.itemId!);

      if (data.success) {
         fetchConversation();
      }
   };

   useEffect(() => {
      fetchConversation();
   }, []);

   useEffect(() => {
      if (!socket) return;

      socket?.on("recieve_message", (payload) => {
         if (payload.conversationId === conversationId) {
            setTempMessage((prev) => prev.filter((m) => payload.content != m));
            setMessages((prev) => [...prev, payload]);
         }
      });

      return () => {
         socket?.off("recieve_message");
      };
   }, [socket]);

   useEffect(() => {
      if (!convo) return;

      setMessages(convo.messages);
   }, [convo?.messages]);

   useEffect(() => {
      if (!messagesRef.current) return;
      messagesRef.current.scrollTo({
         top: messagesRef.current?.scrollHeight,
         behavior: "smooth",
      });
   }, [messages, tempMessage]);

   return (
      <div
         className={`w-full lg:w-4/5 h-full ${
            isMobile ? (showMessage ? "flex" : "hidden") : "flex"
         }`}>
         <div className="w-full h-full overflow-hidden relative flex flex-col">
            <div className="w-full p-2 px-3 mt-0.5 flex items-center gap-2 bg-sidebar border-b sticky">
               <ArrowLeft
                  className="block lg:hidden"
                  color="rgb(50,50,50)"
                  onClick={() => setShowMessage(false)}
               />
               <Avatar className="w-max h-9">
                  <AvatarImage
                     className="object-cover"
                     src={convo?.item?.attachments[0]}
                     alt="@shadcn"
                  />
                  <AvatarFallback>img</AvatarFallback>
               </Avatar>
               <small className="text-sm leading-none font-medium flex item-center gap-2">
                  {convo?.item.name}
                  <span className="text-xs font-semibold text-gray-400 flex gap-2">
                     {convo?.isMine ? "🏷️ My Item" : "💬 Claiming Item"}
                     <span>-</span>
                     {convo?.name}
                     {convo?.item.status == "CLAIMED" && (
                        <span className="text-emerald-400 text-md ml-4">
                           Claimed
                        </span>
                     )}
                  </span>
               </small>
               {convo?.isMine && (
                  <div className="ml-auto">
                     <DropdownMenu>
                        <DropdownMenuTrigger className="p-0.5 lg:px-2 lg:py-1 rounded cursor-pointer">
                           <Ellipsis />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                           <DropdownMenuItem>
                              <button
                                 className="ml-auto text-sm px-4 py-2 rounded-sm text-primary cursor-pointer"
                                 onClick={() =>
                                    router.push(
                                       `/report/${
                                          convo.item.type == "FOUND"
                                             ? "claim"
                                             : "return"
                                       }?conversationId=${convo.id}`
                                    )
                                 }>
                                 Mark as{" "}
                                 {convo.item.status == "CLAIMED"
                                    ? "unclaimed"
                                    : convo.item.type == "FOUND"
                                    ? "claimed"
                                    : "returned"}
                              </button>
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
               )}
            </div>
            <div
               className="w-full max-h-full bg-background flex flex-col gap-0.5 px-3 p-2 overflow-y-auto flex-1"
               ref={messagesRef}>
               {messages?.map((message) => (
                  <div
                     key={message.id}
                     className={`w-fit px-3 py-1.5 rounded-md text-[rgb(23,23,23)] ${
                        user?.id === message.authorId
                           ? "self-end bg-blue-200"
                           : "bg-gray-200"
                     }`}>
                     {message.content}
                  </div>
               ))}
               {tempMessage?.map((message, i) => (
                  <div
                     key={i}
                     className={`w-fit px-3 py-1.5 rounded-md self-end bg-blue-200`}>
                     {message}
                  </div>
               ))}
            </div>
            {convo?.item.status != "CLAIMED" ? (
               <form
                  className={`flex ${
                     chatDetails.previewURL.length > 0
                        ? "items-end"
                        : "items-center"
                  } px-3 p-2 gap-3 border-t bg-sidebar`}
                  onSubmit={(e) => send(e)}>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <Button
                           className="rounded-full bg-blue-600 overflow-hidden hover:bg-blue-600"
                           size="icon">
                           <Label
                              className="h-full w-full flex justify-center cursor-pointer"
                              htmlFor="attach">
                              <Image
                                 className="cursor-pointer"
                                 color="rgb(245,245,245)"
                                 size={18}
                              />
                              <Input
                                 type="file"
                                 id="attach"
                                 className="hidden"
                                 multiple
                                 onChange={(e) => {
                                    setChatDetails((prev) => ({
                                       ...prev,
                                       attachment: e.target.files
                                          ? Array.from(e.target.files)
                                          : [],
                                       previewURL: [
                                          ...prev.previewURL,
                                          ...Array.from(
                                             e.target.files ?? []
                                          ).map((file) =>
                                             URL.createObjectURL(file)
                                          ),
                                       ],
                                    }));
                                    e.target.value = "";
                                 }}
                              />
                           </Label>
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent>Attach image</TooltipContent>
                  </Tooltip>
                  <div className="px-1 h-max w-full border border-black/30 rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl rounded-br-3xl bg-input space-y-5 overflow-x-hidden">
                     <div className="w-full m-0 overflow-x-auto">
                        <div className="flex w-max">
                           {chatDetails.previewURL.map((src, i) => (
                              <div key={i} className="p-2 mb-5 mt-1 relative">
                                 <img
                                    className="h-15 w-15 rounded-xl"
                                    src={src}></img>
                                 <Button
                                    size="icon"
                                    className="pb-1 absolute top-0 right-0 border border-ring bg-secondary text-primary cursor-pointer hover:bg-muted-foreground rounded-full h-6 w-6"
                                    onClick={() => {
                                       setChatDetails((prev) => ({
                                          ...prev,
                                          previewURL: prev.previewURL.filter(
                                             (_, index) => index !== i
                                          ),
                                       }));
                                    }}>
                                    x
                                 </Button>
                              </div>
                           ))}
                        </div>
                     </div>
                     <Input
                        className="w-full border-none py-0 dark:bg-transparent rounded-full focus-visible:ring-0"
                        placeholder="Type Here..."
                        value={chatDetails.text}
                        onChange={(e) =>
                           setChatDetails((prev) => ({
                              ...prev,
                              text: e.target.value,
                           }))
                        }
                     />
                  </div>
                  <Button
                     className="rounded-full bg-transparent"
                     size="icon"
                     type="submit">
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <div className="p-2 h-full w-full flex items-center justify-center rounded-full bg-blue-600 cursor-pointer">
                              <SendHorizontal
                                 color="rgb(245,245,245)"
                                 size={18}
                              />
                           </div>
                        </TooltipTrigger>
                        <TooltipContent>Send Message</TooltipContent>
                     </Tooltip>
                  </Button>
               </form>
            ) : (
               <div className="text-center p-4 bg-sidebar text-gray-500 border-t">
                  Item is claimed. Nothing to discuss further
               </div>
            )}
         </div>
      </div>
   );
}
