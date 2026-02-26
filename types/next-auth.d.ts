// Extensão dos tipos do NextAuth para incluir o id do usuário na sessão
// Necessário para acessar session.user.id nos Server Components

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** ID do usuário — usado como customerId na UnblockPay */
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /** ID do usuário armazenado no token JWT */
    id?: string;
  }
}
