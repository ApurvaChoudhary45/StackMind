"use client";

import { useState } from "react";
import {
  Check,
  Sparkles,
  Rocket,
} from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  const freeFeatures = [
    "3 Projects",
    "50 Notes",
    "20 Bugs",
    "20 Snippets",
    "10 AI Queries / day",
    "Journal (Last 7 days)",
    "5 AI Code Reviews / day",
    "VS Code Extension",
    "CLI Tool",
  ];

  const proFeatures = [
    "Unlimited Projects",
    "Unlimited Notes",
    "Unlimited Bugs",
    "Unlimited Snippets",
    "Unlimited AI Queries",
    "Unlimited AI Code Reviews",
    "Full Journal History",
    "GitHub Import",
    "Priority Support",
    "VS Code Extension",
    "CLI Tool",
  ];

  return (
    <section className="relative min-h-screen overflow-y-auto bg-white py-24 text-black dark:bg-black dark:text-white">
  {/* Background Glow */}
  <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[140px] dark:bg-emerald-500/20" />
  <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-emerald-400/5 blur-[130px] dark:bg-emerald-400/10" />
  <div className="absolute right-0 top-1/3 h-[250px] w-[250px] rounded-full bg-green-500/5 blur-[120px] dark:bg-green-500/10" />

  <div className="relative mx-auto max-w-4xl px-10">
    {/* Heading */}
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1 text-sm text-emerald-600 backdrop-blur dark:border-emerald-500/30 dark:text-emerald-300">
        <Sparkles className="h-4 w-4" />
        Simple Pricing
      </div>

      <h1 className="text-5xl font-bold tracking-tight md:text-3xl">
        Pricing that
        <span className="block bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-500 bg-clip-text text-transparent">
          grows with you
        </span>
      </h1>

      <p className="mt-6 text-md text-zinc-600 dark:text-zinc-400">
        Organize your projects, bugs, notes, snippets and let AI help you build
        faster.
      </p>

      {/* Toggle */}
      <div className="mt-4 flex items-center justify-center gap-5">
        <span
          className={`font-medium ${
            !annual
              ? "text-black dark:text-white"
              : "text-zinc-500 dark:text-zinc-500"
          }`}
        >
          Monthly
        </span>

        <button
          onClick={() => setAnnual(!annual)}
          className={`relative h-8 w-16 rounded-full transition-all duration-300 ${
            annual ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-800"
          }`}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all duration-300 ${
              annual ? "left-9" : "left-1"
            }`}
          />
        </button>

        <div className="flex items-center gap-2">
          <span
            className={`font-medium ${
              annual
                ? "text-black dark:text-white"
                : "text-zinc-500 dark:text-zinc-500"
            }`}
          >
            Annual
          </span>

          <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
            Save 20%
          </span>
        </div>
      </div>
    </div>

    {/* Cards */}
    <div className="mt-10 grid gap-10 lg:grid-cols-2">
      {/* FREE */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm backdrop-blur-xl transition duration-500 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-white/5 dark:hover:border-zinc-700 dark:hover:bg-white/10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Free</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Perfect for getting started.
            </p>
          </div>

          <Rocket className="h-10 w-10 text-zinc-400 dark:text-zinc-500" />
        </div>

        <div className="mb-8">
          <span className="text-6xl font-bold">$0</span>
          <span className="ml-2 text-zinc-500">Forever</span>
        </div>

        <Link href='/Login'><button className="mb-10 w-full rounded-xl border border-zinc-300 py-3 font-semibold transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900">
          Start Free
        </button></Link>

        <div className="space-y-4">
          {freeFeatures.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300"
            >
              <Check className="h-5 w-5 text-emerald-400" />
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* PRO */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-300 bg-gradient-to-b from-emerald-50 to-white p-8 shadow-lg backdrop-blur-xl transition duration-500 hover:scale-[1.02] dark:border-emerald-500/40 dark:bg-gradient-to-b dark:from-emerald-500/15 dark:to-zinc-900 dark:shadow-[0_0_80px_rgba(16,185,129,0.25)]">
        {/* Badge */}
        <div className="absolute right-6 top-6 rounded-full bg-emerald-500 px-4 py-1 text-sm font-semibold text-black">
          Most Popular
        </div>

        <div className="mb-6">
          <h2 className="text-3xl font-bold">Pro</h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            Everything you need to build without limits.
          </p>
        </div>

        <div className="mb-8">
          <span className="text-6xl font-bold">
            {annual ? "$48" : "$5"}
          </span>

          <span className="ml-2 text-zinc-500 dark:text-zinc-400">
            / {annual ? "year" : "month"}
          </span>

          <div className="mt-3 text-emerald-600 dark:text-emerald-300">
            {annual
              ? "≈ ₹4,608/year (Save 20%)"
              : "≈ ₹480/month"}
          </div>
        </div>

         <Link href='/Login'><button
            className="mb- w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 py-3 font-semibold text-black transition hover:scale-[1.02] p-3"
        >
            Upgrade to Pro
        </button></Link>

        <div className="space-y-4 pt-3">
          {proFeatures.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 text-zinc-800 dark:text-zinc-100"
            >
              <Check className="h-5 w-5 text-emerald-500 dark:text-emerald-300" />
              {feature}
            </div>
          ))}
        </div>

        
      </div>
      
    </div>
    <div className="mt-24 rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-100/50 via-white to-emerald-100/50 p-10 text-center backdrop-blur dark:border-emerald-500/20 dark:from-emerald-500/10 dark:via-transparent dark:to-emerald-500/10">
  <h3 className="text-3xl font-bold">
    Build smarter with StackMind
  </h3>

  <p className="mx-auto mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
    One place for your projects, bugs, notes, snippets and AI-powered
    development workflow.
  </p>

  <button className="mt-8 rounded-xl bg-emerald-500 px-8 py-3 font-semibold text-black transition hover:bg-emerald-400">
    Get Started
  </button>
</div>
  </div>
</section>
  );
}