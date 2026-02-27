// Configuração central do NextAuth — importar daqui em toda a aplicação
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession as nextAuthGetServerSession } from "next-auth/next";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "@/lib/users";

// Opções de configuração do NextAuth
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      // Campos que serão enviados no formulário de login
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      // Valida as credenciais do usuário contra o banco de dados
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Busca o usuário pelo e-mail no banco de dados
        const user = await findUserByEmail(credentials.email);
        if (!user) return null;

        // Compara a senha informada com o hash armazenado
        const senhaValida = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (!senhaValida) return null;

        // Retorna os dados do usuário — id = customerId da UnblockPay
        return { id: user.customerId, name: user.name, email: user.email };
      },
    }),
  ],
  // Estratégia JWT — sem necessidade de sessão no banco de dados
  session: { strategy: "jwt" },
  // Redireciona para a página de login customizada ao invés do padrão do NextAuth
  pages: { signIn: "/login" },
  callbacks: {
    // Persiste o id do usuário no token JWT ao fazer login
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    // Expõe o id do usuário na sessão para uso nos Server Components
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

// Wrapper que facilita buscar a sessão em Server Components e Server Actions
export function getServerSession() {
  return nextAuthGetServerSession(authOptions);
}
