const FAST_FLAGS = [
  /suicide|kill myself|end my life/i,
  /self[-\s]?harm|cutting/i,
  /overdose|poison myself/i,
  /i have a plan|goodbye forever/i
];

export function quickFlag(text: string) {
  return FAST_FLAGS.some(r => r.test(text));
}

export type RiskLevel = "none" | "concern" | "high";

export async function classifyRiskLLM(message: string): Promise<RiskLevel> {
  if (quickFlag(message)) return "high";
  const len = message.length;
  if (len > 400 && /hopeless|worthless|can't go on/i.test(message)) return "concern";
  return "none";
}

export const CRISIS_RESPONSE = (country = process.env.DEFAULT_COUNTRY || "Sri Lanka") => `
I'm not a replacement for professional help.
If you feel in immediate danger, please contact emergency services (1990 in Sri Lanka via Suwaseriya).
You can also reach:
• National Mental Health Helpline: 1926
• CCCline: 1333
• Sumithrayo: +94 11 2696666
If you can, talk to someone you trust. I can stay with you here and offer grounding exercises.
`;
