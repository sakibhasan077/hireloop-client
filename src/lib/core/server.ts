import "server-only";
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation";

export const getServerSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session;
};

export const getToken = async () =>{
    const session = await getServerSession();
    if(!session || !session?.session.token){
        redirect("/unauthorized")
    }
    return session?.session.token;
}

// get data 
export const authFetch = async (api:string) => {
    const token = await getToken()
    const res = await fetch(api,{
        headers:{
            authorization: `Bearer ${token}`
        }
    })
    return res 
}

export const protectedMutation = async (api:string,method:string, data?:unknown) =>{
    const token = await getToken();
    console.log("token:",token)
    const res= await fetch(api,{
        method: method,
        headers:{
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
        },
        body: data? JSON.stringify(data) : null,
    })
    return res; 
}

export const requireRole = async (role: string) => {
    const session = await getServerSession();
    if (!session || session?.user.role !== role) {
        redirect("/unauthorized");
    }
    return session;
}
