import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChartNoAxesCombined, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "./brand/Logo";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="app-atmosphere min-h-screen text-[var(--text-primary)]">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-[var(--border-primary)] bg-[var(--bg-header)] px-6 backdrop-blur-xl">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-medium text-[#A7B1C5] md:flex">
          <a href="#home" className="hover:text-white">Home</a>
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#about" className="hover:text-white">About</a>
          <a href="#contact" className="hover:text-white">Contact</a>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => navigate("/login")}>Login</Button>
          <Button variant="primary" onClick={() => navigate("/signup")}>Register</Button>
        </div>
      </header>

      <section id="home" className="page-enter mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-[#16D9FF]">
            Premium personal finance
          </div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Master Your Financial Future
          </h1>
          <p className="mt-5 max-w-xl text-base text-[#A7B1C5] sm:text-lg">
            Track expenses, understand spending patterns, and take control of your financial life.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="primary" size="lg" onClick={() => navigate("/signup")}>
              Start Free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
              Explore Features
            </Button>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-[#A7B1C5]">Dashboard preview</p>
            <span className="rounded-full bg-[#1677FF]/15 px-2 py-0.5 text-[11px] text-[#16D9FF]">Financely</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Balance", "Income", "Expenses", "Savings"].map((label, index) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-[#6F7B91]">{label}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#1677FF] to-[#16D9FF]"
                    style={{ width: `${55 + index * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 h-36 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex h-full items-end gap-2">
              {[40, 62, 48, 78, 55, 70, 46, 84].map((height, index) => (
                <div key={index} className="flex-1 rounded-t-md bg-gradient-to-t from-[#1677FF]/20 to-[#16D9FF]/80" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl border-t border-white/10 px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">Built for financial clarity</h2>
          <p className="mt-2 text-sm text-[#A7B1C5]">The same dark workspace you use after you sign in.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: ChartNoAxesCombined, title: "Visual Analytics", copy: "See income and expenses over time with clean charts." },
            { icon: Wallet, title: "Smart Tracking", copy: "Add, edit, and filter every transaction in one place." },
            { icon: ShieldCheck, title: "Secure Access", copy: "JWT-protected routes keep your workspace private." },
          ].map((feature) => (
            <div key={feature.title} className="glass-card glass-card-hover p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1677FF]/10 text-[#16D9FF]">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-[#A7B1C5]">{feature.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto max-w-5xl px-6 py-16">
        <div className="glass-card p-8">
          <h2 className="mb-4 text-2xl font-bold">About Financely</h2>
          <p className="text-sm leading-relaxed text-[#A7B1C5]">
            Financely is a personal finance workspace for tracking income, expenses, and trends without noise.
            Sign in to use your real data — this landing page is the same product, not a different theme.
          </p>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-xl px-6 pb-20">
        <div className="glass-card p-8">
          <h2 className="mb-6 text-center text-xl font-bold">Get in Touch</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Input placeholder="Name" />
            <Input type="email" placeholder="Email address" />
            <textarea
              rows={3}
              placeholder="How can we help?"
              className="w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-input)] p-3 text-sm text-white placeholder-[#6F7B91] focus:border-[#1677FF] focus:outline-none"
            />
            <Button variant="primary" className="w-full">Send Message</Button>
          </form>
        </div>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-[#6F7B91]">
        © {new Date().getFullYear()} Financely. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
