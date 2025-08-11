"use client";
export default function SafetyBanner({ visible, message }: { visible: boolean; message: string; }) {
  if (!visible) return null;
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6">
      <p className="font-medium">Safety Notice</p>
      <p className="opacity-90 whitespace-pre-line">{message}</p>
    </div>
  );
}
