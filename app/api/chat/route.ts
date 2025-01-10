import { CoreMessage, generateText, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  try {
    console.log("/ai endpoint called");
    const { messages }: { messages: CoreMessage[] } = await req.json();
    console.log("/ai endpoint Request Body:", messages);

    const result = streamText({
      model: openai('gpt-4'),
      system: 'You are a helpful assistant.',
      messages,
    });

    console.log("Generated Response:", result);
    return result.toDataStreamResponse();

  } catch (error) {
    console.error("Error in POST /api/chat:", error);
    return new Response("An error occurred.", { status: 500 });
  }
}
