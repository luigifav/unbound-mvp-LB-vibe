// Configuração central do NextAuth — importar daqui em toda a aplicação
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession as nextAuthGetServerSession } from "next-auth/next";

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
      // Função que valida as credenciais do usuário
      async authorize(credentials) {
        // TODO: substituir por busca real no banco de dados
        if (
          credentials?.email === "teste@unbound.com" &&
          credentials?.password === "senha123"
        ) {
          // Retorna o objeto do usuário em caso de sucesso
          return { id: "1", name: "Usuário Teste", email: "teste@unbound.com" };
        }
        // Retorna null se as credenciais forem inválidas
        return null;
      },
    }),
  ],
  // Estratégia JWT — sem necessidade de sessão no banco de dados
  session: { strategy: "jwt" },
  // Redireciona para a página de login customizada ao invés do padrão do NextAuth
  pages: { signIn: "/login" },
};

// Wrapper que facilita buscar a sessão em Server Components e Server Actions
export function getServerSession() {
  return nextAuthGetServerSession(authOptions);
}
