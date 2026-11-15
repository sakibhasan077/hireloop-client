import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Check, KeyRound } from "lucide-react";

import { paymentCheckout } from "@/lib/actions/jobs";
import { stripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Payment Successful — HireLoop",
  description: "Your HireLoop Pro upgrade is active.",
};

export default async function CheckOutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { session_id } = await searchParams;
  const sessionId = Array.isArray(session_id) ? session_id[0] : session_id;

  if (!sessionId)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const { status, payment_status, amount_total, currency } =
    await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent"],
    });

  if (status === "open") {
    return redirect("/");
  }

  if (status !== "complete" || payment_status !== "paid") {
    return redirect("/payment");
  }

  await paymentCheckout(sessionId);

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: (currency ?? "usd").toUpperCase(),
  }).format((amount_total ?? 0) / 100);

  return (
    <main className="relative min-h-svh overflow-hidden bg-[#050505] px-4 pt-24 pb-16 font-manrope text-white sm:pt-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1b1b1d_0%,#0c0c0d_40%,#050505_75%)]"
      />

      <section
        aria-labelledby="success-heading"
        className="relative z-10 mx-auto w-full max-w-md"
      >
        {/* Check badge, overlapping the top edge of the card */}
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 left-1/2 h-44 w-[115%] -translate-x-1/2 rounded-full bg-[#4c5cff]/25 blur-[80px]"
          />

          <div
            aria-hidden="true"
            className="absolute -top-7 left-1/2 z-10 flex size-14 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-b from-[#34d399] to-[#059669] text-white shadow-[0_0_30px_rgba(16,185,129,0.45)] ring-4 ring-[#131417]"
          >
            <Check className="size-6" strokeWidth={3} />
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#17181c] to-[#0d0e10] px-6 pt-12 pb-7 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] sm:px-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_65%)]"
            />

            <span className="relative inline-flex items-center rounded-md border border-emerald-400/20 bg-emerald-400/5 px-2.5 py-1 font-mono text-[9px] font-medium tracking-[0.15em] text-emerald-300/80 uppercase">
              Upgrade successful
            </span>

            <h1
              id="success-heading"
              className="relative mt-4 text-xl font-semibold tracking-tight text-white sm:text-2xl"
            >
              Welcome to HireLoop Pro
            </h1>

            <p className="relative mt-3 text-sm text-neutral-300">
              Your payment of{" "}
              <span className="font-semibold text-white">
                {formattedAmount}
              </span>{" "}
              was received perfectly.
            </p>

            <p className="relative mx-auto mt-4 max-w-xs text-[13px] leading-relaxed text-neutral-400">
              Your account has been upgraded automatically. You now have
              complete access to all Pro features.
            </p>

            <div className="relative mt-6 flex flex-wrap items-center justify-center gap-2 sm:justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 font-mono text-[10px] text-neutral-400">
                <KeyRound className="size-3.5 text-neutral-500" />
                Session ID Validated
              </span>

              <span className="inline-flex items-center rounded-md border border-emerald-400/25 bg-emerald-400/5 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.12em] text-emerald-300/80 uppercase">
                Payment confirmed
              </span>
            </div>

            <Link
              href="/dashboard/seeker"
              className="relative mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-neutral-200 focus-visible:ring-3 focus-visible:ring-white/30 focus-visible:outline-none"
            >
              Go to My Seeker Dashboard
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
