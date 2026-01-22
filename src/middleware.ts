import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // 1. Definição de rotas protegidas
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    const isLoginPage = request.nextUrl.pathname === '/admin/login'

    // Se não for rota de admin, segue o baile
    if (!isAdminRoute) {
        return NextResponse.next()
    }

    // 2. Configuração do Supabase no Middleware
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 3. Verifica Sessão
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // CASO 1: Usuário não logado tentando acessar dashboard
    // Exceção: Se ele já estiver na página de login, deixa passar
    if (!user && !isLoginPage) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
    }

    // CASO 2: Usuário logado
    if (user) {
        // Se ele está tentando ir pro login, manda pro dashboard direto
        if (isLoginPage) {
            const url = request.nextUrl.clone()
            url.pathname = '/admin/dashboard'
            return NextResponse.redirect(url)
        }

        // VERIFICAÇÃO DE WHITELIST (apenas para rotas internas do admin)
        // Busca na tabela admin_access
        const { data: access } = await supabase
            .from('admin_access')
            .select('role')
            .eq('email', user.email)
            .single()

        // Se não estiver na whitelist, chuta de volta
        if (!access) {
            console.warn(`[AUTH] Acesso negado para: ${user.email}`)
            // Desloga o usuário intruso
            await supabase.auth.signOut()

            const url = request.nextUrl.clone()
            url.pathname = '/' // Manda pra home pública
            return NextResponse.redirect(url)
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths starting with /admin
         */
        '/admin/:path*',
    ],
}
