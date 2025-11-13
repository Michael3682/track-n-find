'use client'

import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import { ChevronUp, LogOut } from "lucide-react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Homepage() {
    const [isClicked, setIsClicked] = useState(false)

    const dropdownRef = useRef<HTMLDivElement | null>(null)

    const handleDropdownToggle = () => {
        setIsClicked(!isClicked)
    }

    const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setIsClicked(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className="w-auto h-auto bg-[rgb(245,245,245)] relative">
            <div className="absolute w-full flex justify-between items-center px-20 py-2.5">
                <Button variant="ghost" className="pl-0 h-auto cursor-pointer hover:bg-transparent">
                    <Link className="flex w-fit items-center gap-2" href="/homepage">
                        <img className="h-10" src="track-n-find--logo.png" alt="logo" />
                        <h1 className="text-2xl font-mediumbold tracking-tight">TrackNFind</h1>
                    </Link>
                </Button>
                <div className="border rounded-lg border-black/60 flex gap-3 items-center p-2 backdrop-blur overflow-hidden">
                    <Button className="rounded-md cursor-pointer hover:bg-gray-300/25" variant="ghost">
                        <Link className="py-0" href="/home">Home</Link>
                    </Button>
                    <Button className="rounded-md cursor-pointer hover:bg-gray-300/25" variant="ghost">
                        <Link href="/browse">Browse</Link>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="rounded-md cursor-pointer hover:bg-gray-300/25" variant="ghost" onPointerDown={handleDropdownToggle}>
                                Report
                                <ChevronUp className={isClicked ? "rotate-180 transition-transform duration-75 ease-linear" : "rotate-0 transition-transform duration-75 ease-linear"} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent ref={dropdownRef}>
                            <DropdownMenuItem className="cursor-pointer">Lost Item</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Found Item</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button className="rounded-md cursor-pointer hover:bg-gray-300/25" variant="ghost">
                        <Link href="/messages">Messages</Link>
                    </Button>
                    <Button className="rounded-md cursor-pointer hover:bg-gray-300/25" variant="ghost">
                        <Link href="/profile">Profile</Link>
                    </Button>
                    <hr className="w-9 border-black rotate-90" />
                    <Button className="w-auto h-auto bg-red-600 rounded-md hover:bg-red-600 cursor-pointer">
                        <Link className="flex items-center gap-2" href="/login"><LogOut /> Logout</Link>
                    </Button>
                </div>
            </div>
            <div className="h-screen px-20 flex justify-start items-center">
                <div className="flex flex-col gap-3 items-start w-1/2">
                    <h1 className="text-7xl font-extrabold tracking-tight">
                        Help Your Community Find What’s Lost
                    </h1>
                    <p className="text-muted-foreground text-xl">
                        Our app helps you quickly report lost items and find what you’ve misplaced at school.
                        <br />
                        It’s simple, secure, and community-driven.
                    </p>
                    <Button className="mt-5 px-9 py-6 text-lg rounded-md bg-blue-700 cursor-pointer hover:bg-blue-700">Search Lost & Found Items</Button>
                </div>
            </div>
        </div>
    )
}
