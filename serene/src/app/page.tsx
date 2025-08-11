export default function HomePage() {
  return (
    <section className="grid gap-6 sm:grid-cols-2 items-center">
      <div className="space-y-4">
        <h2 className="text-3xl sm:text-4xl font-semibold">Gentle support when you need it</h2>
        <p className="text-ink-600">
          Confidential, empathetic guidance, CBT-style reframing, and local resources.
          Your messages are not stored by default.
        </p>
        <div className="flex gap-3">
          <a href="/chat" className="rounded-2xl bg-black text-white px-5 py-2">Start chatting</a>
          <a href="#trust" className="rounded-2xl border px-5 py-2">How it works</a>
        </div>
      </div>
      <div className="rounded-2xl border bg-white p-6">
        <ul className="text-sm space-y-2">
          <li>✔️ No sign up required (anonymous session)</li>
          <li>✔️ Crisis detection with immediate resources</li>
          <li>✔️ WCAG AA-friendly interface</li>
        </ul>
      </div>
      <div id="trust" className="sm:col-span-2 rounded-2xl border bg-white p-6">
        <h3 className="text-lg font-medium mb-2">Trust & Safety</h3>
        <p className="text-sm text-ink-700">
          Not for emergencies. In Sri Lanka, call 1990 (Suwaseriya). Helplines: 1926, 1333, Sumithrayo +94 11 2696666.
        </p>
      </div>
    </section>
  );
}
