"use client";

import {  useEffect, useState } from "react";
import { SearchForm } from "@/components/search-form";
import { NavigationBar } from "@/components/navigationbar";
import { Card, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function Messages({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [searchItem, setSearchItem] = useState("");
  const [conversations, setConversations] = useState([])

  const items = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    description:
      "A black leather business bag was turned in to our office earlier today. The bag features a structured rectangular design with silver-toned hardware and a reinforced handle.",
  }));

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchItem.toLowerCase())
  );

  useEffect(() => {
    
  }, [])

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
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="w-full h-max bg-transparent overflow-hidden rounded-md flex flex-row gap-2 px-3 py-3 shadow-none border-none hover:bg-black/3 cursor-pointer"
              >
                <Avatar className="w-auto h-13">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>img</AvatarFallback>
                </Avatar>
                <CardDescription className="w-full pr-2">
                  <p className="text-base font-medium text-[rgb(20,20,20)] overflow-hidden">
                    {item.name}
                  </p>
                  <div className="w-55 text-sm text-ellipsis whitespace-nowrap overflow-hidden">
                    {item.description}
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
