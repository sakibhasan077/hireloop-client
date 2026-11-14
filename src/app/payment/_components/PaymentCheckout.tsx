"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Check, Lock, Minus, Plus, ShieldCheck } from "lucide-react";
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
import { cn } from "@/lib/utils";

const MONTHLY_PRICE = 29;
const YEARLY_PRICE = 290;
const YEARLY_SAVINGS = MONTHLY_PRICE * 12 - YEARLY_PRICE;
const MIN_SEATS = 1;
const MAX_SEATS = 20;

const BILLING_CYCLES = [
  {
    id: "monthly",
    label: "Monthly",
    description: "Billed every month",
    price: MONTHLY_PRICE,
    priceLabel: " / mo",
  },
  {
    id: "yearly",
    label: "Yearly",
    description: "Billed once a year",
    price: YEARLY_PRICE,
    priceLabel: " / yr",
    badge: "Save $58/seat",
  },
] as const;

type BillingCycle = (typeof BILLING_CYCLES)[number]["id"]; // I don't understand this part 

const PLAN_FEATURES = [
  "Unlimited job postings",
  "Featured job listings",
  "Priority candidate support",
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatPrice = (value: number) => currency.format(value);

const PaymentCheckout = () => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [seats, setSeats] = useState(MIN_SEATS);

  const selectedCycle = BILLING_CYCLES.find(
    (cycle) => cycle.id === billingCycle,
  )!;
  const total = selectedCycle.price * seats;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO: create a Stripe Checkout Session with the selected plan and seats:
    // const response = await fetch("/api/checkout", {
    //   method: "POST",
    //   body: JSON.stringify({ billingCycle, seats }),
    // });
    // const { url } = await response.json();
    // window.location.href = url;

    toast("Stripe checkout will be connected soon.");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]"
    >
      <Card className="gap-0 border border-white/10 bg-[#101010]/90 py-0 shadow-2xl shadow-black/40 ring-0 backdrop-blur">
        <CardHeader className="gap-1.5 border-b border-white/5 px-6 py-5">
          <CardTitle className="font-manrope text-base font-semibold text-white">
            Plan details
          </CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            Choose how you&apos;d like to be billed and how many seats you need.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 px-6 py-6">
          <fieldset>
            <legend className="text-sm font-medium text-neutral-200">
              Billing cycle
            </legend>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {BILLING_CYCLES.map((cycle) => {
                const isSelected = billingCycle === cycle.id;

                return (
                  <label
                    key={cycle.id}
                    className={cn(
                      "relative flex cursor-pointer flex-col rounded-lg border p-4 transition-colors focus-within:ring-2 focus-within:ring-[#5C53FE]/30",
                      isSelected
                        ? "border-[#5C53FE] bg-[#5C53FE]/10"
                        : "border-white/10 bg-white/3 hover:border-white/20",
                    )}
                  >
                    <input
                      type="radio"
                      name="billingCycle"
                      value={cycle.id}
                      checked={isSelected}
                      onChange={() => setBillingCycle(cycle.id)}
                      className="sr-only"
                    />

                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-white">
                        {cycle.label}
                      </span>
                      {"badge" in cycle ? (
                        <Badge className="border-transparent bg-emerald-500/15 text-[10px] text-emerald-400">
                          {cycle.badge}
                        </Badge>
                      ) : null}
                    </span>

                    <span className="mt-1 text-xs text-neutral-400">
                      {cycle.description}
                    </span>

                    <span className="mt-3 text-lg font-semibold tracking-tight text-white">
                      {formatPrice(cycle.price)}
                      <span className="text-xs font-normal text-neutral-400">
                        {cycle.priceLabel}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <Separator className="bg-white/10" />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-200">Team seats</p>
              <p className="mt-0.5 text-xs text-neutral-400">
                Add teammates to your workspace. {formatPrice(selectedCycle.price)}{" "}
                per seat.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                aria-label="Remove a seat"
                disabled={seats === MIN_SEATS}
                onClick={() => setSeats((count) => Math.max(MIN_SEATS, count - 1))}
                className="flex size-8 items-center justify-center rounded-md border border-white/10 text-neutral-400 transition-colors hover:border-white/20 hover:text-white disabled:pointer-events-none disabled:opacity-40"
              >
                <Minus className="size-3.5" />
              </button>

              <span
                aria-live="polite"
                className="w-9 text-center text-sm font-medium text-white"
              >
                {seats}
              </span>

              <button
                type="button"
                aria-label="Add a seat"
                disabled={seats === MAX_SEATS}
                onClick={() => setSeats((count) => Math.min(MAX_SEATS, count + 1))}
                className="flex size-8 items-center justify-center rounded-md border border-white/10 text-neutral-400 transition-colors hover:border-white/20 hover:text-white disabled:pointer-events-none disabled:opacity-40"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>

          <div className="flex gap-3 rounded-lg border border-white/10 bg-white/3 p-3.5">
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
                HireLoop Pro
              </CardTitle>
              <CardDescription className="mt-1 text-xs text-neutral-400">
                {selectedCycle.label} subscription
              </CardDescription>
            </div>
            <Badge className="border-transparent bg-[#5C53FE]/15 text-[#9C96FF]">
              Pro
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 px-6 py-5">
          <ul className="space-y-2.5">
            {PLAN_FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-xs text-neutral-300"
              >
                <Check
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-emerald-400"
                />
                {feature}
              </li>
            ))}
          </ul>

          <Separator className="bg-white/10" />

          <dl className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-neutral-400">
                Pro plan × {seats} {seats === 1 ? "seat" : "seats"}
              </dt>
              <dd className="text-white">{formatPrice(total)}</dd>
            </div>

            {billingCycle === "yearly" ? (
              <div className="flex items-center justify-between gap-3">
                <dt className="text-neutral-400">You save</dt>
                <dd className="text-emerald-400">
                  {formatPrice(YEARLY_SAVINGS * seats)}
                </dd>
              </div>
            ) : null}

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
              {formatPrice(total)}
            </span>
          </div>

          <Button
            type="submit"
            className="h-11 w-full bg-[#5C53FE] text-sm text-white hover:bg-[#5C53FE]/90"
          >
            <Lock className="size-4" />
            Pay {formatPrice(total)}
          </Button>

          <p className="text-center text-[11px] leading-relaxed text-neutral-500">
            {billingCycle === "monthly"
              ? "Billed monthly"
              : "Billed annually"}{" "}
            · Cancel anytime.
          </p>

          <div className="flex flex-wrap items-center gap-1.5 border-t border-white/5 pt-4">
            {["Visa", "Mastercard", "Amex"].map((method) => (
              <span
                key={method}
                className="rounded border border-white/10 bg-white/3 px-1.5 py-0.5 text-[10px] font-medium text-neutral-400"
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
