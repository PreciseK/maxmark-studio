"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/cn";

const planDetails: Record<
  string,
  {
    name: string;
    amountDisplay: string;
    intervalDisplay: string;
    description: string;
    badge: string;
    benefits: string[];
  }
> = {
  lifetime: {
    name: "Lifetime All-Access",
    amountDisplay: "₦150,000",
    intervalDisplay: "one-time payment",
    description: "Permanent ownership of all current and upcoming animation masterclasses forever.",
    badge: "Best Value",
    benefits: [
      "Permanent lifetime access to all masterclasses",
      "All future course additions included forever",
      "Full library of prompt bibles, character turnaround templates & DaVinci/ComfyUI presets",
      "Direct entry to private Maxmark creator circle",
      "Official certificate of completion",
    ],
  },
  subscription_monthly: {
    name: "Monthly Membership",
    amountDisplay: "₦25,000",
    intervalDisplay: "/ month",
    description: "Flexible recurring access with full library unlock and ongoing mentorship.",
    badge: "Flexible",
    benefits: [
      "Access to all course video masterclasses",
      "Downloadable project files & presets",
      "Monthly live Q&A sessions",
      "Cancel anytime without penalty",
    ],
  },
  subscription_yearly: {
    name: "Annual Membership",
    amountDisplay: "₦200,000",
    intervalDisplay: "/ year",
    description: "12 months of full access with priority critique and early releases.",
    badge: "Save 33%",
    benefits: [
      "Save ₦100,000 compared to monthly billing",
      "All monthly membership benefits included",
      "Priority portfolio review from studio directors",
      "Early preview of upcoming tools and case studies",
    ],
  },
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPlan = searchParams.get("plan") || "lifetime";
  const [selectedPlan, setSelectedPlan] = useState<string>(
    planDetails[initialPlan] ? initialPlan : "lifetime"
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Verification state if redirected back from Paystack
  const isCallback = searchParams.get("status") === "callback";
  const reference = searchParams.get("reference");
  const [verifying, setVerifying] = useState(isCallback);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  useEffect(() => {
    if (isCallback && reference) {
      setVerifying(true);
      fetch("/api/academy/paystack/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setVerifiedSuccess(true);
            setTimeout(() => {
              router.push("/academy/learn");
            }, 1800);
          } else {
            setErrorMessage(data.error || "Payment verification failed.");
            setVerifying(false);
          }
        })
        .catch((err) => {
          setErrorMessage("Failed to verify payment with server.");
          setVerifying(false);
        });
    }
  }, [isCallback, reference, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/academy/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tierId: selectedPlan,
          email,
          name,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.authorizationUrl) {
        throw new Error(data.error || "Payment initialization failed.");
      }

      // Redirect to Paystack secure checkout
      window.location.href = data.authorizationUrl;
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  const currentTier = planDetails[selectedPlan];

  // Callback Verification Screen
  if (verifying) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-950 border border-white/15 rounded-2xl p-8 text-center space-y-6">
          {!verifiedSuccess ? (
            <>
              <div className="w-16 h-16 border-4 border-[#E3FF39] border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold uppercase tracking-tight text-white">
                  Verifying Payment...
                </h3>
                <p className="text-xs text-neutral-400 font-mono">
                  Confirming your transaction with Paystack and activating your student portal.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-[#E3FF39]/20 text-[#E3FF39] border-2 border-[#E3FF39] rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                ✓
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold uppercase tracking-tight text-white">
                  Payment Verified!
                </h3>
                <p className="text-xs text-neutral-400">
                  Welcome to the Academy. Redirecting you to your learning portal...
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-3">
          <Link
            href="/academy"
            className="text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-[#E3FF39] transition-colors"
          >
            ← Back to Academy Overview
          </Link>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Secure Checkout
          </h1>
          <p className="text-sm text-neutral-400">
            Complete your enrollment. Instant access to all tutorials, video player, and project files.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Form: Plan Selector & Customer Information */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Choose Plan */}
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-[#E3FF39]">
                01 // SELECT YOUR ENROLLMENT TIER
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.entries(planDetails).map(([key, plan]) => {
                  const isSelected = selectedPlan === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedPlan(key)}
                      className={cn(
                        "p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between",
                        isSelected
                          ? "bg-white/[0.08] border-[#E3FF39] shadow-[0_0_20px_rgba(227,255,57,0.15)]"
                          : "bg-white/[0.02] border-white/10 hover:border-white/20"
                      )}
                    >
                      <div>
                        <span className="text-[10px] font-mono text-[#E3FF39] uppercase font-bold block mb-1">
                          {plan.badge}
                        </span>
                        <span className="text-xs font-bold text-white block mb-1">
                          {plan.name}
                        </span>
                      </div>
                      <div className="mt-4 pt-2 border-t border-white/10">
                        <span className="text-base font-extrabold text-white">
                          {plan.amountDisplay}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 block">
                          {plan.intervalDisplay}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Customer Details */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <span className="text-xs font-mono uppercase tracking-wider text-[#E3FF39] block">
                02 // STUDENT CREDENTIALS
              </span>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-[#E3FF39]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                    Email Address (For Student Portal Login)
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@creative.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-[#E3FF39]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#E3FF39] text-black font-extrabold uppercase text-xs tracking-wider hover:bg-[#d6f030] transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer shadow-xl shadow-[#E3FF39]/20"
              >
                {loading ? "Initializing Paystack Checkout..." : `Pay ${currentTier.amountDisplay} with Paystack →`}
              </button>

              <p className="text-[11px] text-neutral-500 text-center font-mono">
                🔒 Card, Bank Transfer, USSD & Apple Pay supported via Paystack secure rails.
              </p>
            </form>
          </div>

          {/* Right Summary: Order Details */}
          <div className="lg:col-span-5 bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-md space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block border-b border-white/10 pb-4">
              ORDER SUMMARY
            </span>

            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-bold text-white">{currentTier.name}</h3>
                <span className="text-xl font-extrabold text-[#E3FF39]">
                  {currentTier.amountDisplay}
                </span>
              </div>
              <span className="text-xs text-neutral-400 font-mono">
                {currentTier.intervalDisplay}
              </span>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                {currentTier.description}
              </p>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-3">
              <span className="text-xs font-mono uppercase text-neutral-300">
                Included in this enrollment:
              </span>
              <ul className="space-y-2">
                {currentTier.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-neutral-300">
                    <span className="text-[#E3FF39] font-bold">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>TOTAL DUE TODAY</span>
              <span className="text-lg font-bold text-white">{currentTier.amountDisplay}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-[#E3FF39] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
