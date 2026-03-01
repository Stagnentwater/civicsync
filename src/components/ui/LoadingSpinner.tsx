export default function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16" role="status" aria-live="polite">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-zinc-200 border-t-zinc-800 mb-3" aria-hidden="true" />
      <p className="text-zinc-500 text-sm">{text}</p>
    </div>
  );
}
