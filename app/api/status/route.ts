import { NextResponse } from "next/server"
import { multiAI } from "@/adaptors/multi-ai.adaptor"
import { getAuthStatus } from "../auth/auth-options"

export async function GET() {
    const aiStatus = multiAI.getProviderStatus()
    const authStatus = getAuthStatus()

    return NextResponse.json({
        ai: {
            providers: aiStatus,
            setupInstructions: multiAI.getSetupInstructions(),
            activeProvider: aiStatus.find(p => p.available)?.name || "mock",
        },
        auth: authStatus,
        recommendations: {
            freeAI: [
                {
                    name: "Groq",
                    url: "https://groq.com/",
                    description: "Fast free inference with Llama models",
                    envVar: "GROQ_API_KEY"
                },
                {
                    name: "Hugging Face",
                    url: "https://huggingface.co/settings/tokens",
                    description: "Free transformer models",
                    envVar: "HUGGINGFACE_API_KEY"
                }
            ],
            auth: authStatus.hasGoogleOAuth
                ? "Google OAuth is configured"
                : "Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET for full OAuth, or use guest access",
        }
    })
}