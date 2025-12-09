"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Conversation } from "@/types/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { getConversations } from "@/lib/chatService";
import { SearchForm } from "@/components/search-form";
import { useAuth } from "@/contexts/auth/AuthContext";
import { NavigationBar } from "@/components/navigationbar";
import { Card, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageProvider, useMessage } from "@/contexts/messages/MessageContext";


export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <MessageProvider>
      <Messages>{children}</Messages>
    </MessageProvider>
  )
}

function Messages({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMobile = useIsMobile();
  const [searchItem, setSearchItem] = useState("");
  const { showMessage, setShowMessage } = useMessage();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const router = useRouter()
  const { socket } = useAuth()

  const filteredConversations = conversations.filter((conversation) =>
    conversation.item.name.toLowerCase().includes(searchItem.toLowerCase())
  );

  useEffect(() => {
    getConversations().then(([data]) => setConversations(data.conversations))
  }, [])

  useEffect(() => {
    if (!socket) return

    socket?.on("new_message", payload => {
      setConversations(payload)
    })

    return () => {
      socket?.off("new_message")
    }
  }, [socket])

  return (
    <div className="w-auto h-screen relative overflow-hidden">
      <NavigationBar className="fixed" />
      <div className="w-full h-full flex pt-12.5">
        <div className={`w-full lg:w-max h-full p-3 lg:px-8 lg:pt-5 border-r bg-sidebar relative space-y-5 ${isMobile ? (showMessage ? "hidden" : "block") : "block"}`}>
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
          <div className="w-full h-screen overflow-y-auto space-y-2">
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className="w-full h-max bg-transparent overflow-hidden rounded-md flex flex-row gap-2 px-3 py-3 shadow-none border-none hover:bg-black/3 cursor-pointer"
                onClick={() => {router.push(`/messages/${conversation.id}`); setShowMessage(!showMessage)}}
              >
                <Avatar className="w-auto h-13">
                  <AvatarImage
                    className="object-cover"
                    src={conversation.item.attachments[0]}
                    alt="@shadcn"
                  />
                  <AvatarFallback>img</AvatarFallback>
                </Avatar>
                <CardDescription className="w-full pr-2">
                  <p className="text-base font-medium text-primary overflow-hidden flex items-center gap-2">
                    {conversation.item.name}
                    <span className="text-xs font-semibold text-gray-400">
                      {conversation.isMine ? "🏷️ My Item" : "💬 Claiming Item"}
                      {conversation?.item.status == "CLAIMED" && 
                        <span className="text-emerald-400 text-md ml-4">Claimed</span>
                      }
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
