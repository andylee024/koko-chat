import { Configuration, OpenAIApi } from "openai-edge"

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openaiClient = new OpenAIApi(config)

// IMPORTANT! Set the runtime to edge
export const runtime = "edge"

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json()

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openaiClient.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "system",
        content: "You are StoryBot, an AI assistant designed to help gather stories, anecdotes, and memories for a children's story book unborn niece. Your goal is encourage users share heartwarming, funny, or meaningful stories that can be incorporated into the book. Be friendly, engaging, ask follow-up questions draw out more details from users' stories."
      },
      ...messages
    ]
  })
  return response

}

