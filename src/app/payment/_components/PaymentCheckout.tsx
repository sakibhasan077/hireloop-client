"use client";

import type { FormEvent } from "react";
import {
  BriefcaseBusiness,
  Check,
  Lock,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PRICE = 49;

const INCLUDED = [
  "One active job listing for 30 days",
  "Standard placement in search results",
  "Edit or close your listing anytime",
  "No subscription or recurring charges",
];

const STEPS = [
  "Pay securely through Stripe.",
  "Add your job title, details, and requirements.",
  "Publish and start receiving applications.",
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatPrice = (value: number) => currency.format(value);

const PaymentCheckout = () => {

  return (
    <form action="/api/checkout_sessions" method="POST"

      className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]"
    >
      <Card className="gap-0 border border-white/10 bg-[#101010]/90 py-0 shadow-2xl shadow-black/40 ring-0 backdrop-blur">
        <CardHeader className="gap-1.5 border-b border-white/5 px-6 py-5">
          <CardTitle className="font-manrope text-base font-semibold text-white">
            Order details
          </CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            One job posting, paid once. No subscription required.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 px-6 py-6">
          <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#5C53FE]/15 text-[#9C96FF]">
              <BriefcaseBusiness className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">Job Posting</p>
              <p className="mt-0.5 text-xs text-neutral-400">
                Publish one role on HireLoop for 30 days.
              </p>
            </div>
          </div>

          <ul className="space-y-2.5">
            {INCLUDED.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-xs text-neutral-300"
              >
                <Check
                  aria-hidden="true"
                  className="mt-0.5 size-3.5 shrink-0 text-emerald-400"
                />
                {item}
              </li>
            ))}
          </ul>

          <Separator className="bg-white/10" />

          <div>
            <p className="text-sm font-medium text-neutral-200">
              How it works
            </p>
            <ol className="mt-3 space-y-2.5">
              {STEPS.map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-3 text-xs text-neutral-400"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[10px] font-medium text-white">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3.5">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-[#8B85FF]"
            />
            <p className="text-xs leading-relaxed text-neutral-400">
              Card details are handled securely by Stripe. After clicking pay,
              you&apos;ll be redirected to Stripe&apos;s checkout to complete
              your payment.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0 border border-white/10 bg-[#101010]/90 py-0 shadow-2xl shadow-black/40 ring-0 backdrop-blur lg:sticky lg:top-24">
        <CardHeader className="gap-3 border-b border-white/5 px-6 py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="font-manrope text-base font-semibold text-white">
                Job Posting
              </CardTitle>
              <CardDescription className="mt-1 text-xs text-neutral-400">
                One-time purchase
              </CardDescription>
            </div>
            <Badge className="border-transparent bg-[#5C53FE]/15 text-[#9C96FF]">
              One-time
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 px-6 py-5">
          <dl className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-neutral-400">Job posting</dt>
              <dd className="text-white">{formatPrice(PRICE)}</dd>
            </div>

            <div className="flex items-center justify-between gap-3">
              <dt className="text-neutral-400">Duration</dt>
              <dd className="text-xs text-neutral-500">30 days</dd>
            </div>

            <div className="flex items-center justify-between gap-3">
              <dt className="text-neutral-400">Tax</dt>
              <dd className="text-xs text-neutral-500">
                Calculated at checkout
              </dd>
            </div>
          </dl>

          <Separator className="bg-white/10" />

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-white">
              Total due today
            </span>
            <span className="text-lg font-semibold tracking-tight text-white">
              {formatPrice(PRICE)}
            </span>
          </div>
          {/*
            <form action="/api/checkout_sessions" method="POST">
      <section>
        <button type="submit" role="link">
          Checkout
        </button>
      </section>
    </form>
          */}

          <Button
            type="submit"
            role="link"
            className="h-11 w-full bg-[#5C53FE] text-sm text-white hover:bg-[#5C53FE]/90 cursor-pointer"
          >
            <Lock className="size-4" />
            Pay {formatPrice(PRICE)}
          </Button>

          <p className="text-center text-[11px] leading-relaxed text-neutral-500">
            One-time payment · No recurring charges.
          </p>

          <div className="flex flex-wrap items-center gap-1.5 border-t border-white/5 pt-4">
            {["Visa", "Mastercard", "Amex"].map((method) => (
              <span
                key={method}
                className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10px] font-medium text-neutral-400"
              >
                {method}
              </span>
            ))}

            <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-neutral-500">
              <Lock aria-hidden="true" className="size-3" />
              Powered by Stripe
            </span>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default PaymentCheckout;
