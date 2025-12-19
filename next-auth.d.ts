import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's postal address. */
            username?: string | null;
            id?: string | null;
        } & DefaultSession["user"];
    }

    interface User {
        username?: string | null;
        deviceIdFromAuth?: string;
    }
}
