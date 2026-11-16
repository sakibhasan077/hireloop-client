import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation";

export const getServerSession = async () => {
    "use server";
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session;
};


export const requireRole = async (role: string) => {
    const session = await getServerSession();
    if (!session || session?.user.role !== role) {
        redirect("/unauthorized");
    }
    return session;
}
