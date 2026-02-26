// Middleware de proteção de rotas — executado antes de cada requisição
// Redireciona para /login se o usuário não estiver autenticado
import { withAuth } from "next-auth/middleware";

export default withAuth({
  // Página para onde redirecionar quando não autenticado
  pages: { signIn: "/login" },
});

export const config = {
  // Define quais rotas serão protegidas pelo middleware
  // /login e /register não estão incluídas aqui, portanto são públicas
  matcher: [
    "/dashboard/:path*",
    "/send/:path*",
    "/receive/:path*",
    "/transactions/:path*",
  ],
};
