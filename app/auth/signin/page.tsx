"use client"

import { signIn, getProviders } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignIn() {
    const [providers, setProviders] = useState<any>(null)
    const [guestEmail, setGuestEmail] = useState("demo@example.com")

    useEffect(() => {
        const loadProviders = async () => {
            const res = await getProviders()
            setProviders(res)
        }
        loadProviders()
    }, [])

    const handleGuestSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        await signIn("guest", { email: guestEmail })
    }

    return (
        <div className="container mx-auto max-w-md mt-20">
            <div className="space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Sign In</h1>
                    <p className="text-gray-600 mt-2">Choose your sign-in method</p>
                </div>

                {/* Google OAuth (if available) */}
                {providers?.google && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Full Access</h2>
                        <Button
                            onClick={() => signIn("google")}
                            className="w-full"
                            variant="outline"
                        >
                            Sign in with Google
                        </Button>
                        <p className="text-sm text-gray-500">
                            Requires invitation and full account features
                        </p>
                    </div>
                )}

                {/* Guest Access */}
                <div className="space-y-4 border-t pt-6">
                    <h2 className="text-xl font-semibold">Guest Access</h2>
                    <form onSubmit={handleGuestSignIn} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email (for demo only)</Label>
                            <Input
                                id="email"
                                type="email"
                                value={guestEmail}
                                onChange={(e) => setGuestEmail(e.target.value)}
                                placeholder="demo@example.com"
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Continue as Guest
                        </Button>
                    </form>
                    <p className="text-sm text-gray-500">
                        Free access to test AI features without account setup
                    </p>
                </div>

                {/* Setup Instructions */}
                <div className="border-t pt-6 space-y-4">
                    <h2 className="text-xl font-semibold">Setup Instructions</h2>

                    <div className="space-y-3">
                        <div>
                            <h3 className="font-medium">🤖 Free AI Options Available:</h3>
                            <ul className="text-sm text-gray-600 ml-4 list-disc">
                                <li>Groq API (fast, free tier) - <a href="https://groq.com/" className="text-blue-600">groq.com</a></li>
                                <li>Hugging Face (free tier) - <a href="https://huggingface.co/settings/tokens" className="text-blue-600">huggingface.co/settings/tokens</a></li>
                                <li>Mock AI (demo mode, no setup required)</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-medium">🔑 Optional Google OAuth:</h3>
                            <p className="text-sm text-gray-600">
                                Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env for full OAuth
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}