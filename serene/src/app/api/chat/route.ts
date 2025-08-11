import { NextRequest } from "next/server";
import { openai } from "@/lib/openai";
import { classifyRiskLLM, CRISIS_RESPONSE } from "@/lib/crisis";
import { redactForLogs } from "@/lib/moderation";
import { ChatRequestSchema } from "@/lib/schema";

export const runtime = "edge";

const SYSTEM_PROMPT = `You are "Serene", a supportive mental-health chatbot.
Boundaries:
- Provide psychoeducation, coping strategies, CBT-style reframes, and resource signposting.
- You are not a clinician and do not diagnose.
- If user expresses self-harm/suicidal intent or acute risk, switch to CRISIS MODE:
  * Acknowledge feelings empathetically.
  * Encourage immediate help; provide emergency contacts relevant to the user's region when known.
  * Avoid any instructions for self-harm or other harm.
- Always be empathetic, concise, and culturally sensitive. Use plain language.
- Never store PII. Avoid asking for real names, addresses, or numbers.`;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Invalid payload" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  const { messages, country } = parsed.data;
  const lastUser = [...messages].reverse().find(m => m.role === "user")?.content ?? "";

  // Risk guard
  const risk = await classifyRiskLLM(lastUser);
  if (risk === "high") {
    return new Response(
      JSON.stringify({ mode: "crisis", content: CRISIS_RESPONSE(country) }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // OpenAI call
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    stream: false
  });

  console.log("[chat]", redactForLogs(lastUser).slice(0, 200)); // redacted

  return new Response(
    JSON.stringify({ mode: "normal", content: completion.choices[0]?.message?.content ?? "" }),
    { headers: { "Content-Type": "application/json" } }
  );
}
