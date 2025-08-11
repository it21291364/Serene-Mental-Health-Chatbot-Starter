export function redactForLogs(text: string) {
  return text
    .replace(/\b(\+?\d[\d\s-]{6,})\b/g, "[phone]")
    .replace(/\b[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}\b/g, "[email]");
}
