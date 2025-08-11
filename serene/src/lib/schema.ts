import { z } from "zod";

export const ChatMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]).default("user"),
  content: z.string().min(1).max(4000)
});

export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema),
  country: z.string().optional()
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
