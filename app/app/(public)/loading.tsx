export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">
      <div className="w-10 h-10 border-2 border-white/10 border-t-red-500 rounded-full animate-spin"></div>
    </div>
  );
}
