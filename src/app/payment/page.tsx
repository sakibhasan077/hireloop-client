import type { Metadata } from "next";
import { Lock } from "lucide-react";

import PaymentCheckout from "./_components/PaymentCheckout";

export const metadata: Metadata = {
  title: "Payment — HireLoop",
  description: "Complete your secure HireLoop Pro payment.",
};

const PaymentPage = () => {
  return (
    <main className="relative min-h-svh overflow-hidden bg-[#050505] px-4 pt-24 pb-16 font-manrope text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#292929_0%,#111111_35%,#050505_70%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <header className="mx-auto max-w-xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-neutral-400">
            <Lock aria-hidden="true" className="size-3" />
            Secure checkout
          </span>

          <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            Complete your payment
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            You&apos;re one step away from unlocking HireLoop Pro.
          </p>
        </header>

        <div className="mt-8">
          <PaymentCheckout />
        </div>
      </div>
    </main>
  );
};

export default PaymentPage;
