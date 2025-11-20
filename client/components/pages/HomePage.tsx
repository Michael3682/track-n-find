'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronUp, LogOut, Mail, Pin, Phone } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { logout } from "@/lib/authService"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth/AuthContext"

export default function Homepage() {
    const [isClicked, setIsClicked] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const router = useRouter()
    const { refetch } = useAuth()
    const items = [
        {
            id: 1,
            name: "Item A",
            url: "/"
        },
        {
            id: 2,
            name: "Item B",
            url: "/"
        },
        {
            id: 3,
            name: "Item C",
            url: "/"
        }
    ]

    const dropdownRef = useRef<HTMLDivElement | null>(null)

    const handleDropdownToggle = () => {
        setIsClicked(!isClicked)
    }

    const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setIsClicked(false)
        }
    }

    const handleScroll = () => {
        if (window.scrollY > 50) {
            setIsScrolled(true)
        }
        else {
            setIsScrolled(false)
        }
    }

    const handleLogout = async () => {
       const [data, err] = await logout()

       if(err || !data.success) {
        return console.log('There is a problem logging out')
       }

       await refetch()
       router.refresh()
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('scroll', handleScroll)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <div className="w-auto h-auto bg-[rgb(245,245,245)] relative">
            <div className={`w-screen flex justify-between items-center gap-10 px-10 py-1 fixed z-50 ${isScrolled ? 'bg-[rgb(245,245,245)]' : 'bg-transparent'} transition-all duration-400 ease-linear`}>
                <Button variant="ghost" className="h-auto pl-0 cursor-pointer hover:bg-transparent">
                    <Link href="/homepage">
                        <img className="h-8" src="track-n-find--logo.png" alt="logo" />
                    </Link>
                </Button>
                <div className="flex gap-5 items-center p-2 overflow-hidden background-blur-2xl">
                    <Button className={`rounded-md cursor-pointer ${isScrolled ? 'text-[rgb(20,20,20)] hover:bg-black/90 hover:text-[rgb(245,245,245)]' : 'text-[rgb(245,245,245)]'} transition-all duration-150 ease-linear`} variant="ghost">
                        <Link className="py-0" href="/home">Home</Link>
                    </Button>
                    <Button className={`rounded-md cursor-pointer ${isScrolled ? 'text-[rgb(20,20,20)] hover:bg-black/90 hover:text-[rgb(245,245,245)]' : 'text-[rgb(245,245,245)]'} transition-all duration-150 ease-linear`} variant="ghost">
                        <Link href="/browse">Browse</Link>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className={`rounded-md cursor-pointer ${isScrolled ? 'text-[rgb(20,20,20)] hover:bg-black/90 hover:text-[rgb(245,245,245)]' : 'text-[rgb(245,245,245)]'} transition-all duration-150 ease-linear`} variant="ghost" onPointerDown={handleDropdownToggle}>
                                Report
                                <ChevronUp className={isClicked ? "rotate-180 transition-transform duration-75 ease-linear" : "rotate-0 transition-transform duration-75 ease-linear"} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent ref={dropdownRef} className="p-2 space-y-2">
                            <DropdownMenuItem className="font-semibold p-2 cursor-pointer text-[rgb(20,20,20)]">Lost Item</DropdownMenuItem>
                            <DropdownMenuItem className="font-semibold p-2 cursor-pointer text-[rgb(20,20,20)]">Found Item</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button className={`rounded-md cursor-pointer ${isScrolled ? 'text-[rgb(20,20,20)] hover:bg-black/90 hover:text-[rgb(245,245,245)]' : 'text-[rgb(245,245,245)]'} transition-all duration-150 ease-linear`} variant="ghost">
                        <Link href="/messages">Messages</Link>
                    </Button>
                    <Button className={`rounded-md cursor-pointer ${isScrolled ? 'text-[rgb(20,20,20)] hover:bg-black/90 hover:text-[rgb(245,245,245)]' : 'text-[rgb(245,245,245)]'} transition-all duration-150 ease-linear`} variant="ghost">
                        <Link href="/profile">Profile</Link>
                    </Button>
                </div>
                <Button className="bg-blue-700 rounded-md hover:bg-blue-600 cursor-pointer" onClick={() => handleLogout()}>
                    <Link className="flex p-2 items-center gap-2" href="/"><LogOut />Logout</Link>
                </Button>
            </div>
            <div className="h-screen px-20 flex justify-start items-center relative">
                <div className="w-full h-full flex flex-col justify-center items-center gap-3 z-10">
                    <h1 className="w-max text-6xl font-bold text-center text-[rgb(245,245,245)]">
                        Help Your School Community Find What’s Lost
                    </h1>
                    <p className="text-lg text-center w-3xl font-normal text-balance text-[rgb(200,200,200)]">
                        Easily report, search, and reunite lost items in your school
                    </p>
                    <Button className="mt-3 p-5 rounded-md bg-blue-700 cursor-pointer hover:bg-blue-600">
                        <Link className="text-base" href="/browse">Start Searching</Link>
                    </Button>
                </div>
                <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover filter brightness-20 z-0">
                    <source src="/videos/background.mp4" type="video/mp4" />
                </video>
            </div>
            <div className="w-full h-full px-10 py-20 flex flex-col gap-20">
                <div>
                    <h1 className="text-4xl font-normal text-start text-[rgb(20,20,20)]">
                        Recent Found Items
                    </h1>
                    <div className="h-full w-full flex justify-between gap-5 mt-10 shadow-lg">
                        {items.map((item) => (
                            <Card key={item.id} className="w-1/4 h-max rounded-md bg-transparent shadow-none border-none">
                                <CardHeader>
                                    <CardTitle><img className="invert" src="vercel.svg" alt="image" /></CardTitle>
                                </CardHeader>
                                <CardDescription className="px-5 text-2xl text-[rgb(20,20,20)]">{item.name}</CardDescription>
                                <CardAction className="px-5">
                                    <Button className="bg-blue-700 rounded-md hover:bg-blue-600 cursor-pointer">
                                        <Link href={item.url}>
                                            View Details
                                        </Link>
                                    </Button>
                                </CardAction>
                            </Card>
                        ))}
                    </div>
                </div>
                <Separator className="bg-black/20" />
                <div>
                    <h1 className="text-4xl font-normal text-start text-[rgb(20,20,20)]">
                        Recent Lost Items
                    </h1>
                    <div className="h-full w-full flex justify-between gap-5 mt-10 shadow-sm">
                        {items.map((item) => (
                            <Card key={item.id} className="w-1/4 h-max rounded-md bg-transparent shadow-none border-none">
                                <CardHeader>
                                    <CardTitle><img className="invert" src="vercel.svg" alt="image" /></CardTitle>
                                </CardHeader>
                                <CardDescription className="px-5 text-2xl text-[rgb(20,20,20)]">{item.name}</CardDescription>
                                <CardAction className="px-5">
                                    <Button className="bg-blue-700 rounded-md hover:bg-blue-600 cursor-pointer">
                                        <Link href={item.url}>
                                            View Details
                                        </Link>
                                    </Button>
                                </CardAction>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
            <footer className="bg-[rgb(20,20,20)] p-10 space-y-8">
                <div className="w-1/2 flex flex-col gap-5">
                    <h1 className="text-4xl font-bold text-start text-blue-600">
                        TrackNFind
                    </h1>
                    <p className="text-lg font-semibold text-[rgb(200,200,200)] text-balance">TrackNFind is a community-driven platform connecting people who have lost belongings with those who have found them. Together, we make recovery faster, easier, and more efficient for everyone.</p>
                    <div className="flex flex-col gap-2">
                        <small className="text-[rgb(200,200,200)] text-sm leading-none font-medium flex gap-2"><Mail size={20}/>support@tracknfind.com</small>
                        <small className="text-[rgb(200,200,200)] text-sm leading-none font-medium flex gap-2"><Pin size={20}/>123 Community St, Tech City, TC 12345</small>
                        <small className="text-[rgb(200,200,200)] text-sm leading-none font-medium flex gap-2"><Phone size={20}/>1-800-TRACK-IT (1-800-872-2548)</small>
                    </div>
                </div>
                <Separator className="bg-white/20" />
                <div className="flex justify-between">
                    <p className="text-base font-semibold text-[rgb(200,200,200)] text-balance">@ 2025 TrackNFind Inc. All rights reserved. Helping communities reconnect with their belongings since 2025.</p>
                    <div className="flex gap-5">
                        <img className="h-8" src="vercel.svg" alt="logo" />
                        <img className="h-8" src="vercel.svg" alt="logo" />
                        <img className="h-8" src="vercel.svg" alt="logo" />
                        <img className="h-8" src="vercel.svg" alt="logo" />
                    </div>
                </div>
            </footer>
        </div>
    )
}
