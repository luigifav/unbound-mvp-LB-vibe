export default function Loading() {
  return (
    <main className="min-h-screen bg-[#000904] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-[fadeUp_0.3s_ease_both]">
        <div className="w-10 h-10 border-[3px] border-[rgba(124,34,213,0.3)] border-t-[#7c22d5] rounded-full animate-[spin_0.7s_linear_infinite]" />
        <p className="text-white/30 font-bold text-xs tracking-widest uppercase">
          Carregando
        </p>
      </div>
    </main>
  );
}
