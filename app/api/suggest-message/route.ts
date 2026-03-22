
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { context } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    prompt: `
You are an AI that suggests quick reply messages.

Context:
"${context}"

Generate exactly 3 short reply suggestions.
Each must be:
- One line
- Concise
- Natural

No numbering. No extra text.
    `,
  });

  return result.toTextStreamResponse();
}