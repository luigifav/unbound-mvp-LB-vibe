"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="py-2.5 px-5 bg-transparent border border-white/10 rounded-lg text-white/65 font-bold text-[13px] cursor-pointer transition-all duration-200 tracking-wide hover:border-[#7c22d5] hover:text-white"
    >
      Sair
    </button>
  );
}
