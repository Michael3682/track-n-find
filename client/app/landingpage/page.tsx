'use client'

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function LandingPage() {
    const router = useRouter()

    return (
        <div className="w-auto h-auto flex flex-col bg-[rgb(235,235,235)]">
            <div className="h-screen flex flex-col items-center justify-center gap-5 relative text-[rgb(235,235,235)]">
                <img className="w-screen h-screen absolute top-0 left-0 object-cover brightness-20 z-0 pointer-events-none" src="landing-page--hero-section---background.jpg" alt="" />
                <div className="h-fit flex items-center justify-center gap-2 py-5 absolute top-0 z-50">
                    <img className="h-9" src="track-n-find--logo.png" alt="log" />
                    <h1 className="text-center text-2xl font-extrabold tracking-tight">
                        TrackNFind
                    </h1>
                </div>
                <div className="w-full h-screen flex flex-col items-start justify-center px-20 gap-5 z-10">
                    <h1 className="text-start font-extrabold tracking-tight lg:text-6xl md:text-5xl">
                        Track What’s Lost,
                        <br />
                        Find What’s Found.
                    </h1>
                    <h1 className="lg:text-base font-medium md:text-sm">
                        Our app helps you quickly report lost items and find what you’ve misplaced at school.
                        <br />
                        It’s simple, secure, and community-driven.
                    </h1>
                    <Button className="lg:px-9 lg:py-6 lg:text-lg rounded bg-blue-700 cursor-pointer hover:bg-blue-700 md:text-md md:px-8 md:py-5" onClick={() => router.push('/login')}>Get Started</Button>
                </div>
            </div>
            <div className="w-full h-1/2 px-20 py-30">
                <h1 className="text-center text-3xl font-extrabold tracking-tight mb-15">
                    Why Use TrackNFind?
                </h1>
                <div className="flex flex-row flex-wrap justify-center gap-10">
                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle>Report a Lost Item</CardTitle>
                        </CardHeader>
                        <CardDescription className="px-5">Easily report items you've lost, and track them through our secure platform.</CardDescription>
                    </Card>
                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle>Browse Found Item</CardTitle>
                        </CardHeader>
                        <CardDescription className="px-5">Browse through recently found items that others have reported, and claim yours.</CardDescription>
                    </Card>
                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle>Centralized Tracking</CardTitle>
                        </CardHeader>
                        <CardDescription className="px-5">Track all your lost and found items in one place with real-time updates.</CardDescription>
                    </Card>
                </div>
            </div>
            <footer className="bg-[rgb(10,10,10)] text-[rgb(235,235,235)] px-20 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <div className="text-center sm:text-left">
                            <h1 className="text-6xl font-bold">TrackNFind</h1>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:space-x-6 mt-4 sm:mt-0">
                            <Link href="/about">About</Link>
                            <Link href="/contact">Contact</Link>
                            <Link href="/terms">Terms</Link>
                            <Link href="/privacy">Privacy</Link>
                        </div>
                    </div>
                </div>
                <hr className="my-20 border-white/10" />
                <div className="mt-10 text-center text-muted-foreground text-sm">
                    <p>© 2025 TrackNFind. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}