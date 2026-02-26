// Handler do NextAuth para o App Router do Next.js
// Captura todas as rotas sob /api/auth/* (login, logout, callback, session, etc.)
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// Exporta o mesmo handler para GET e POST, que é o que o NextAuth precisa
export { handler as GET, handler as POST };
