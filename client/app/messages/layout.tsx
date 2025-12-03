"use client";

import {  useEffect, useState } from "react";
import { SearchForm } from "@/components/search-form";
import { NavigationBar } from "@/components/navigationbar";
import { Card, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getConversations } from "@/lib/chatService";
import { Conversation } from "@/types/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth/AuthContext";


export default function Messages({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [searchItem, setSearchItem] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([])
  const router = useRouter()
  const { socket } = useAuth()

  const filteredConversations = conversations.filter((conversation) =>
    conversation.item.name.toLowerCase().includes(searchItem.toLowerCase())
  );

  useEffect(() => {
    getConversations().then(([data]) => setConversations(data.conversations))
  }, [])

  useEffect(() => {
    if(!socket) return
    
    socket?.on("recieve_message", payload => console.log(payload))

    return () => {
      socket?.off("recieve_message")
    }
  }, [socket])

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
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className="w-full h-max bg-transparent overflow-hidden rounded-md flex flex-row gap-2 px-3 py-3 shadow-none border-none hover:bg-black/3 cursor-pointer"
                onClick={() => router.push(`/messages/${conversation.id}`)}
              >
                <Avatar className="w-auto h-13">
                  <AvatarImage
                    src={conversation.item.attachments[0]}
                    alt="@shadcn"
                  />
                  <AvatarFallback>img</AvatarFallback>
                </Avatar>
                <CardDescription className="w-full pr-2">
                  <p className="text-base font-medium text-[rgb(20,20,20)] overflow-hidden flex items-center gap-2">
                    {conversation.item.name}
                    <span className="text-xs font-semibold text-gray-400">
                      {conversation.isMine ? "🏷️ My Item": "💬 Claiming Item"}
                    </span>
                  </p>
                  <div className="w-55 text-sm text-ellipsis whitespace-nowrap overflow-hidden">
                    {conversation.name}
                  </div>
                </CardDescription>
              </Card>
            ))}
          </div>
        </div>
      {children}
      </div>
    </div>
  );
}
