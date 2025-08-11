"use client";
import { useState } from "react";

export default function ConsentModal({ enabled, onClose }: { enabled: boolean; onClose: (consented: boolean) => void; }) {
  const [consent, setConsent] = useState(false);
  if (!enabled) return null;
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm grid place-items-center p-4 z-50">
      <div className="max-w-md w-full rounded-2xl bg-white p-6 space-y-4 border">
        <h3 className="text-lg font-semibold">Data Consent</h3>
        <p className="text-sm text-ink-700">
          By default, Serene does not store your messages. If you turn on saving, your messages may be encrypted and retained for up to 30 days. You can delete them anytime.
        </p>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          I agree to optional saving of my messages.
        </label>
        <div className="flex gap-2 justify-end">
          <button className="rounded-xl border px-3 py-1.5" onClick={() => onClose(false)}>Cancel</button>
          <button className="rounded-xl bg-black text-white px-3 py-1.5" onClick={() => onClose(consent)} disabled={!consent}>Enable</button>
        </div>
      </div>
    </div>
  );
}
