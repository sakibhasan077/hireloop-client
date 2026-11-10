import type { Metadata } from "next";
import Link from "next/link";

import SignInForm from "@/components/auth/SignInForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign In — HireLoop",
  description: "Sign in to your HireLoop account.",
};

const SignInPage = () => {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#050505] px-4 pt-24 pb-12 font-manrope text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#292929_0%,#111111_35%,#050505_70%)]"
      />

      <div className="relative z-10 w-full max-w-md">
        <Card className="gap-0 border border-white/10 bg-[#101010]/90 py-0 shadow-2xl shadow-black/50 ring-0 backdrop-blur">
          <CardHeader className="gap-1.5 border-b border-white/5 px-6 py-6">
            <CardTitle className="font-manrope text-2xl font-semibold tracking-tight text-white">
              Welcome back
            </CardTitle>
            <CardDescription className="text-sm text-neutral-400">
              Sign in to your HireLoop account to continue.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 py-6">
            <SignInForm />
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-[#5C53FE] underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignInPage;
