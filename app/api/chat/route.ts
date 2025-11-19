// Multi-AI provider system with free and paid options
import { multiAI } from "@/adaptors/multi-ai.adaptor"

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = "edge"

// Log available providers on startup
const aiStatus = multiAI.getProviderStatus()
console.log("Available AI providers:", aiStatus.filter(p => p.available).map(p => `${p.name} (${p.cost})`))
if (aiStatus.filter(p => p.available).length === 1 && aiStatus.find(p => p.name === "mock")?.available) {
  console.log("⚠️  Only mock AI available. Add API keys for real AI providers:")
  console.log(multiAI.getSetupInstructions())
}

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json()
  console.log("MESSAGE")
  console.log(messages[0]["content"].includes("Assignment"))

  var systemContent = "You are a teaching assistant for a professor whose job is to write discussion responses back to students who have submitted responses to a discussion prompt. Your job is to take in a professor profile and examples of their style of writing, a discussion prompt, and a student's response and then write a professor response to the student that is concise, clear, and provides helpful feedback to the student. Write in the style of the professor. Do not provide the student the answer, just provide commentary on their answer and how well it relates to the discussion prompt."
  var userContent = "Now please respond to the student's discussion post in the style of the professor."

  if (messages[0]["content"].includes("myTArequestType:")) {
    systemContent = "You are a teaching assistant for a professor whose job is to grade student's assignment submission."
    userContent = "Now please respond to the student's submission according to rubric."


  }

  // if (messages.index("requestType")>0)
  //   console.log("yes")

  const messagesToOpenai = [
    {
      role: "system",
      content:
        systemContent,
    },
    ...messages,
    {
      role: "user",
      content:
        userContent,
    },
  ]
  console.log("messagesToOpenai")
  console.log(messagesToOpenai)
  // Request the OpenAI API for the response based on the prompt

  // Use multi-AI adapter to get best available provider
  try {
    const result = await multiAI.streamChat(messagesToOpenai as any)

    return new Response(result.stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-AI-Provider": result.provider,
        "X-AI-Cost": result.cost,
      },
    })
  } catch (err: any) {
    console.error("AI streaming error", err)
    return new Response(
      JSON.stringify({
        message: "AI service temporarily unavailable",
        detail: err.message,
        availableProviders: multiAI.getProviderStatus().filter(p => p.available)
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
