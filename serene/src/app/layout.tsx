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
      <body className="min-h-dvh antialiased">
        <header className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Serene</h1>
            <nav className="text-sm text-ink-500">
              <a className="hover:underline" href="/chat">Open Chat</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 pb-10">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-10 text-xs text-ink-500">
          <p>Serene provides general supportive information and is not a substitute for professional care.</p>
        </footer>
      </body>
    </html>
  );
}
