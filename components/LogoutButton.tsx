"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = () => {
    sessionStorage.clear();
    signOut({ callbackUrl: "/login" });
  };

  return (
    <button
      onClick={handleLogout}
      className="py-2.5 px-5 bg-transparent border border-white/10 rounded-lg text-white/65 font-bold text-[13px] cursor-pointer transition-all duration-200 tracking-wide hover:border-[#7c22d5] hover:text-white"
    >
      Sair
    </button>
  );
}
