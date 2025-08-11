export default function HowItWorksPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">How Serene Works</h1>
        <p className="text-ink-600">A quick guide to what Serene can and can’t do, how your data is handled, and how we keep you safe.</p>
      </header>

      <section className="rounded-2xl border bg-white p-5 space-y-3">
        <h2 className="text-lg font-medium">What Serene does</h2>
        <ul className="list-disc pl-5 text-ink-700 space-y-1">
          <li>Provides supportive conversation using evidence-informed techniques (CBT-style reframing, grounding).</li>
          <li>Offers journaling prompts, coping tips, and resource signposting.</li>
          <li>Detects crisis language and shows immediate resources for Sri Lanka.</li>
        </ul>
      </section>

      <section className="rounded-2xl border bg-white p-5 space-y-3">
        <h2 className="text-lg font-medium">Conversation flow</h2>
        <ol className="list-decimal pl-5 text-ink-700 space-y-1">
          <li>Open the chat and share what’s on your mind (no account needed).</li>
          <li>Serene replies with empathy and practical next steps.</li>
          <li>Use tools like thought reframing and breathing prompts when suggested.</li>
          <li>End the session anytime. By default, your messages are <span className="font-medium">not saved</span>.</li>
        </ol>
      </section>

      <section className="rounded-2xl border bg-white p-5 space-y-3">
        <h2 className="text-lg font-medium">Privacy & data</h2>
        <p className="text-ink-700">Serene is privacy-first. By default, the app does not store messages or personal information. If you later enable saving, content may be encrypted and auto-deleted after a short retention window. You can delete it anytime.</p>
      </section>

      <section className="rounded-2xl border bg-white p-5 space-y-3">
        <h2 className="text-lg font-medium">Safety & crisis support</h2>
        <p className="text-ink-700">Serene is not a medical device and cannot provide emergency help. If you feel in immediate danger, please call emergency services.</p>
        <ul className="list-disc pl-5 text-ink-700 space-y-1">
          <li><span className="font-medium">Sri Lanka:</span> 1990 (Suwaseriya)</li>
          <li>National Mental Health Helpline: 1926</li>
          <li>CCCline: 1333</li>
          <li>Sumithrayo: +94 11 2696666</li>
        </ul>
      </section>

      <section className="rounded-2xl border bg-white p-5 space-y-3">
        <h2 className="text-lg font-medium">Limitations</h2>
        <ul className="list-disc pl-5 text-ink-700 space-y-1">
          <li>Does not diagnose or replace professional care.</li>
          <li>May occasionally make mistakes—consider information as general guidance.</li>
          <li>For emergencies, use the numbers above or local services.</li>
        </ul>
      </section>

      <div className="flex gap-3">
        <a href="/" className="rounded-2xl border px-5 py-2">Back to Home</a>
        <a href="/chat" className="rounded-2xl bg-black text-white px-5 py-2">Open Chat</a>
      </div>
    </main>
  );
}