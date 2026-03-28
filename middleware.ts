// Middleware de proteção de rotas — executado antes de cada requisição
// Implementa whitelist estrita: rotas fora da lista são redirecionadas.

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const PUBLIC_ROUTES = ['/login', '/register', '/', '/sobre']
const PROTECTED_ROUTES = [
  '/dashboard',
  '/receive',
  '/send',
  '/transactions',
  '/settings',
  '/external-accounts',
]
const ALL_VALID_ROUTES = [...PUBLIC_ROUTES, ...PROTECTED_ROUTES]

// Prefixos que o Next.js e assets estáticos precisam — não interceptar
function isInternalPath(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/apple-icon') ||
    pathname.startsWith('/robots') ||
    pathname.startsWith('/sitemap') ||
    pathname.startsWith('/manifest') ||
    pathname.includes('.')
  )
}

// Verifica se o pathname corresponde a uma rota válida (incluindo sub-paths de rotas protegidas)
function isValidRoute(pathname: string): boolean {
  if (ALL_VALID_ROUTES.includes(pathname)) return true
  // Permite sub-paths de rotas protegidas (ex: /send/abc123, /transactions/abc123)
  return PROTECTED_ROUTES.some(
    (route) => pathname.startsWith(route + '/'),
  )
}

// Verifica se o pathname é uma rota protegida (ou sub-path)
function isProtectedRoute(pathname: string): boolean {
  if (PROTECTED_ROUTES.includes(pathname)) return true
  return PROTECTED_ROUTES.some(
    (route) => pathname.startsWith(route + '/'),
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Não intercepta rotas internas do Next.js, assets estáticos ou API
  if (isInternalPath(pathname)) return NextResponse.next()

  const token = await getToken({ req: request })
  const isAuthenticated = !!token

  // Rota inválida → redireciona conforme autenticação
  if (!isValidRoute(pathname)) {
    const dest = isAuthenticated ? '/dashboard' : '/login'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  // Rota protegida sem autenticação → redireciona para login
  if (isProtectedRoute(pathname) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Rota pública (/login, /register) com autenticação → redireciona para dashboard
  if (['/login', '/register'].includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Executa em todas as rotas exceto as internas do Next.js
  matcher: ['/((?!_next/static|_next/image).*)'],
}
