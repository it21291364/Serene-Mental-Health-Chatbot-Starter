import ClientOnly from "./ClientOnly";
import ChatWindow from "@/components/ChatWindow";

export default function ChatPage() {
  return (
    <section className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-2">Serene — Mental Health Support</h2>
      <p className="text-ink-600 mb-6">Empathetic guidance, coping tools, and resources. Not a medical device.</p>
      <ClientOnly>
        <ChatWindow />
      </ClientOnly>
    </section>
  );
}
