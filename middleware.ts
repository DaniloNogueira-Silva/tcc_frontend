import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Se o usuário tentar acessar "/", redireciona para "/auth/sign-in"
  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/auth/sign-in', req.url));
  }

  return NextResponse.next();
}

// Configura quais rotas o middleware deve verificar
export const config = {
  matcher: ['/'], // 🔥 Aplica o middleware apenas na raiz "/"
};
