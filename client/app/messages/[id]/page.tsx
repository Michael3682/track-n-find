"use client";

import { getSocket } from "@/lib/socket";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { getConversation } from "@/lib/chatService";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Conversation, Message } from "@/types/types";
import { useMessage } from "@/contexts/messages/MessageContext";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Image, SendHorizontal, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toggleItemStatus } from "@/lib/reportService";

export default function Messages() {
  const isMobile = useIsMobile();
  const [convo, setConvo] = useState<Conversation>()
  const { showMessage, setShowMessage } = useMessage()
  const [messages, setMessages] = useState<Message[]>([])
  const [tempMessage, setTempMessage] = useState<string[]>([])
  const messagesRef = useRef<HTMLDivElement>(null)

  const [chatDetails, setChatDetails] = useState({
    text: "",
    attachment: [],
    previewURL: []
  })
  const { id: conversationId } = useParams()
  const { socket, user } = useAuth()

  console.log(convo)
  const send = (e: FormEvent) => {
    e.preventDefault()

    if(chatDetails.text.trim() == "") return

    socket?.emit("send_message", {
      text: chatDetails.text,
      conversationId,
      recepientId: convo?.isMine ? convo?.senderId : convo?.hostId,
      senderId: convo?.isMine ? convo?.hostId : convo?.senderId,
    })

    setTempMessage(prev => ([...prev, chatDetails.text]))
    setChatDetails(prev => ({ ...prev, text: "", attachment: [], previewURL: [] }))
  }

  const fetchConversation = async () => {
    const [data] = await getConversation(String(conversationId))
    setConvo(data.conversation)
  }

  const handleToggleItemStatus = async () => {
    const [data] = await toggleItemStatus(convo?.itemId!)

    if(data.success) {
      fetchConversation()
    }
  }

  useEffect(() => {
    fetchConversation()
  }, [])

  useEffect(() => {
    if (!socket) return

    socket?.on("recieve_message", payload => {
      if (payload.conversationId === conversationId) {
        setTempMessage(prev => prev.filter(m => payload.content != m))
        setMessages(prev => ([...prev, payload]))
      }
    })

    return () => {
      socket?.off("recieve_message")
    }
  }, [socket])

  console.log(messages)

  useEffect(() => {
    if (!convo) return

    setMessages(convo.messages)
  }, [convo?.messages])

  useEffect(() => {
    if(!messagesRef.current) return
    messagesRef.current.scrollTo({
      top: messagesRef.current?.scrollHeight,
      behavior: "smooth"
    })
  }, [messages, tempMessage])

  return (
    <div className={`w-full h-full p-3 ${isMobile ? (showMessage ? "hidden" : "flex") : "flex"}`}>
      <div className="w-full h-full rounded-md border border-black/20 shadow-md shadow-black/50 overflow-hidden bg-[rgb(245,245,245)] relative flex flex-col">
        <div className="w-full p-2 px-3 flex items-center gap-2 bg-white border-b border-b-black/10 sticky">
          <ArrowLeft className="block lg:hidden" color="rgb(50,50,50)" onClick={() => setShowMessage(!showMessage)} />
          <Avatar className="w-max h-8">
            <AvatarImage className="object-cover" src={convo?.item?.attachments[0]} alt="@shadcn" />
            <AvatarFallback>img</AvatarFallback>
          </Avatar>
          <small className="text-sm leading-none font-medium flex item-center gap-2">
            {convo?.item.name}
            <span className="text-xs font-semibold text-gray-400 flex gap-2">
              {convo?.isMine ? "🏷️ My Item" : "💬 Claiming Item"}
              <span>-</span>
              {convo?.name}
              {convo?.item.status == "CLAIMED" && 
                <span className="text-emerald-400 text-md ml-4">Claimed</span>
              }
            </span>
          </small>
          {
            convo?.isMine && 
              <button 
                className="ml-auto text-sm border px-4 py-2 rounded-sm text-gray-400 cursor-pointer hover:text-white hover:shadow-md hover:bg-blue-700"
                onClick={() => handleToggleItemStatus()}
              >
                Mark as {convo.item.status == 'CLAIMED' ? "unclaimed" : 'claimed'}
              </button>
          }
        </div>
        <div className="w-full max-h-full bg-white flex flex-col gap-0.5 px-3 p-2 overflow-y-auto flex-1" ref={messagesRef}>
          {messages?.map((message) => (
            <div key={message.id} className={`w-fit px-3 py-1.5 rounded-md ${user?.id === message.authorId ? 'self-end bg-blue-200' : 'bg-gray-200'}`}>
              {message.content}
            </div>
          ))}
          {tempMessage?.map((message, i) => (
            <div key={i} className={`w-fit px-3 py-1.5 rounded-md self-end bg-blue-200`}>
              {message}
            </div>
          ))}
        </div>
        {convo?.item.status == "UNCLAIMED" ?
           <form className="flex items-center px-3 p-2 gap-3 border-t bg-white" onSubmit={(e) => send(e)}>
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
            value={chatDetails.text}
            onChange={e => setChatDetails(prev => ({ ...prev, text: e.target.value }))}
          />
          <button type="submit">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-2 rounded-full bg-blue-600 cursor-pointer">
                  <SendHorizontal color="rgb(245,245,245)" size={18} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send Message</p>
              </TooltipContent>
            </Tooltip>
          </button>
          </form>
          :
          <div className="text-center p-4 bg-white text-gray-500">Item is claimed. Nothing to discuss further</div>
        }
      </div>
    </div>
  );
}
