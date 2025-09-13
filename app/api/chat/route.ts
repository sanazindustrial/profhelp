import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = "edge"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json()
  console.log("MESSAGE")
  console.log(messages[0]["content"].includes("Assignment"))

  var systemContent="You are a teaching assistant for a professor whose job is to write discussion responses back to students who have submitted responses to a discussion prompt. Your job is to take in a professor profile and examples of their style of writing, a discussion prompt, and a student's response and then write a professor response to the student that is concise, clear, and provides helpful feedback to the student. Write in the style of the professor. Do not provide the student the answer, just provide commentary on their answer and how well it relates to the discussion prompt."
  var userContent="Now please respond to the student's discussion post in the style of the professor."
 
  if(messages[0]["content"].includes("myTArequestType:"))
  {
    systemContent="You are a teaching assistant for a professor whose job is to grade student's assignment submission."
    userContent="Now please respond to the student's submission according to rubric."

    
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
  
  const response = await openai.chat.completions.create({
    model: "gpt-4o-2024-11-20",
    stream: true,
    messages: messages,
  
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)

  // Respond with the stream
  return new StreamingTextResponse(stream)
}
