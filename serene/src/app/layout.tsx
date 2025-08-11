import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Serene — Mental Health Support",
  description: "Empathetic guidance, coping tools, and resources. Not a medical device.",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh antialiased relative">
        {/* Animated ambient background */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[36rem] w-[36rem] rounded-full blur-3xl opacity-50 bg-gradient-to-tr from-fuchsia-400 via-sky-400 to-emerald-400 animate-[float_12s_ease-in-out_infinite]" />
          <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-40 bg-gradient-to-tr from-rose-400 via-orange-300 to-yellow-300 animate-[float_14s_ease-in-out_infinite_reverse]" />
        </div>

        <header className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-fuchsia-500 to-emerald-500">Serene</h1>
            <nav className="text-sm text-ink-600">
              <a className="hover:underline" href="/chat">Open Chat</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 pb-10">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-10 text-xs text-ink-600">
          <p>Serene provides general supportive information and is not a substitute for professional care.</p>
        </footer>
      </body>
    </html>
  );
}