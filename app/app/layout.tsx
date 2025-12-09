import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/signin?callbackUrl=/app");
    }

    return <>{children}</>;
}
