import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/signin',
    },
    session: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        strategy: "jwt",
    },
    providers: [], // Added later in auth.ts
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/app');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                // If user is logged in and visiting auth pages, redirect to dashboard
                if (nextUrl.pathname === '/signin' || nextUrl.pathname === '/signup') {
                    return Response.redirect(new URL('/app', nextUrl));
                }
            }
            return true;
        },
    },
} satisfies NextAuthConfig;
