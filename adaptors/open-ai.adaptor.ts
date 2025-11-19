import fs from "node:fs"
import OpenAI from "openai"

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

class OpenAIAdaptor {
  async createFile(file: any) {
    try {
      return await openai.files.create({
        file: file,
        purpose: "assistants",
      })
    } catch (err) {
      console.log(err)
    }
  }
}

const openAIAdaptor = new OpenAIAdaptor()

export { openAIAdaptor }
