'use client'

import Link from 'next/link'
import TerminalAnimation from './TerminalAnimation'
import DarkMode from './DarkMode'
import { useState } from 'react'
import PricingPage from './PricingPage'

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <main className="bg-background dark:bg-black text-foreground min-h-screen font-sans">

      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md dark:bg-[#080c0a]/95">
      <nav aria-label="Main navigation" className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <span className="font-mono text-green-400 md:text-lg">Stack<span className="text-text-text-muted">//</span>Mind</span>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-text-text-muted hover:text-green-400 text-sm uppercase tracking-widest transition-colors">Features</a>
          <a href="#how" className="text-text-text-muted hover:text-green-400 text-sm uppercase tracking-widest transition-colors">How it works</a>
          <a href="#pricing" className="text-text-text-muted hover:text-green-400 text-sm uppercase tracking-widest transition-colors">Pricing</a>
          <DarkMode />
          <Link href="/Login" className="bg-green-400 text-black font-mono font-bold text-sm px-5 py-2 rounded hover:opacity-80 transition-opacity">
            Start
          </Link>
        </div>

        {/* Mobile right side */}
        <div className="flex md:hidden items-center gap-3">
          <DarkMode />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-green-400/30 text-green-400"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <i className={`ti ${menuOpen ? 'ti-x' : 'ti-menu-2'} text-base`} />
          </button>
        </div>
      </nav>

{menuOpen && (
        <div className="absolute inset-x-0 top-full flex flex-col gap-3 border-b border-border bg-card px-5 py-4 shadow-lg md:hidden dark:bg-[#080c0a]">
          <a
            href="#features"
            onClick={() => setMenuOpen(false)}
            className="text-text-text-muted hover:text-green-400 text-sm uppercase tracking-widest transition-colors py-2 border-b border-border"
          >
            Features
          </a>
          <a
            href="#how"
            onClick={() => setMenuOpen(false)}
            className="text-text-text-muted hover:text-green-400 text-sm uppercase tracking-widest transition-colors py-2 border-b border-border"
          >
            How it works
          </a>
          <a
            href="#pricing"
            onClick={() => setMenuOpen(false)}
            className="text-text-text-muted hover:text-green-400 text-sm uppercase tracking-widest transition-colors py-2 border-b border-border"
          >
            Pricing
          </a>
          <Link
            href="/Login"
            onClick={() => setMenuOpen(false)}
            className="bg-green-400 text-black font-mono font-bold text-sm px-5 py-2.5 rounded hover:opacity-80 transition-opacity text-center mt-1"
          >
            Get Started
          </Link>
        </div>
      )}
      </header>
  {/* HERO */ }
  <section className = "flex items-center px-5 py-14 sm:px-8 lg:min-h-[70svh] lg:py-24" >
    <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
      <div>
        <div className="inline-flex items-center gap-2 bg-green-400/8 border border-green-400/15 rounded-full px-4 py-1.5 font-mono text-xs text-green-400 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
          Built for developers, by developers
        </div>
        <h1 className="text-4xl font-extrabold sm:text-5xl xl:text-6xl leading-[1.05] tracking-tight mb-5 dark:text-white text-black">
          Your second <span className="text-text-muted">brain</span><br />for dev projects
        </h1>
        <p className="text-text-text-muted md:text-lg leading-relaxed mb-8 max-w-md ">
          Notes with syntax highlighting, bug tracking, and a searchable code snippet library — all in one place.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/Login" className="bg-green-400 text-black font-mono font-bold px-4 py-3 text-sm rounded-lg hover:opacity-85 transition-opacity">
            Start for free →
          </Link>
          <a href="#features" className="text-text-muted border border-green-500/30 font-mono text-sm px-4 py-3 rounded-lg hover:bg-green-400/10 transition-colors">
            See features
          </a>
        </div>
        <p className="font-mono text-xs text-text-text-muted mt-4">// Free to start. No credit card required.</p>
      </div>

      {/* TERMINAL */}
      <div className="min-w-0">
        <TerminalAnimation />
      </div>

    </div>
      </section >

  {/* FEATURES */ }
  <section id = "features" className = "dark:bg-[#0f1510] border-y border-green-400/10 scroll-mt-20 px-5 py-14 sm:px-8 lg:py-20 bg-card" >
    <div className="max-w-5xl mx-auto">
      <p className="font-mono text-xs text-green-400 tracking-widest uppercase mb-3">// Features</p>
      <h2 className="text-4xl font-extrabold tracking-tight mb-3 dark:text-white text-black">Everything a dev brain needs</h2>
      <p className="text-text-text-muted mb-12 max-w-lg">Not another generic tool. Built around how developers actually think.</p>
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3 rounded-xl overflow-hidden">
        {[
          { icon: "🧠", title: "Ask your notes anything", id: "ai-search", desc: "RAG-powered AI search across all your notes. Ask why a bug happened last week — it knows." },
          { icon: "🤖", title: "AI bug analyzer", desc: "Describe a bug, get a diagnosis. Powered by Claude with full context from your project notes." },
          { icon: "📝", title: "Rich notes + code blocks", id: "notes", desc: "Syntax-highlighted code blocks for 30+ languages. Your docs live where you work." },
          { icon: "🐛", title: "Kanban bug tracker", id: "bug-tracker", desc: "Drag bugs across Open → In Progress → Fixed with real-time sync." },
          { icon: "📌", title: "Snippet library", id: "snippets", desc: "Save, tag, and search reusable code. Never rewrite the same utility twice." },
          { icon: "🗂️", title: "Project workspaces", desc: "Each project has its own notes, bugs, and snippets — fully isolated." },
          { icon: "⚡", title: "VS Code extension", desc: "Dark mode toggle, GitHub API integration, and productivity shortcuts right inside your editor." },
          { icon: "💻", title: "CLI tool", desc: "Terminal-first workflow with repo integrations, task automation, and lightweight scaffolding." },
          { icon: "📓", title: "Daily journal", desc: "Log milestones, experiments, and bug fixes. Share progress publicly or keep it private." }
        ].map((f) => (
          <div key={f.title} id={f.id} className="scroll-mt-20 dark:bg-[#0f1510] bg-background p-6 dark:hover:bg-[#161d17] hover:bg-card transition-colors">
            <div className="text-2xl mb-4">{f.icon}</div>
            <h3 className="font-bold mb-2 dark:text-white text-black">{f.title}</h3>
            <p className="text-text-text-muted text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
      </section >

  {/* HOW IT WORKS */ }
  <section id = "how" className = "scroll-mt-20 px-5 py-14 sm:px-8 lg:py-20" >
    <div className="max-w-5xl mx-auto">
      <p className="font-mono text-xs text-green-400 tracking-widest uppercase mb-3">// How it works</p>
      <h2 className="text-4xl font-extrabold tracking-tight mb-3 dark:text-white text-black">Up and running in 3 minutes</h2>
      <p className="text-text-text-muted mb-12 max-w-lg">No config files. No setup headaches. Sign in and start building.</p>
      <div className="flex flex-col divide-y divide-green-400/10 border border-green-400/10 rounded-xl overflow-hidden">
        {[
          { num: "01", tag: "auth", title: "Sign in to StackMind", desc: "Continue with GitHub, Google, or your email address." },
          { num: "02", tag: "organize", title: "Create a project workspace", desc: "Give it a name and description. Each project gets its own isolated workspace." },
          { num: "03", tag: "capture", title: "Write notes, track bugs, save snippets", desc: "Start capturing ideas, logging bugs, saving that utility function you keep rewriting." },
          { num: "04", tag: "ship", title: "Move fast, stay organized", desc: "Drag bugs as you fix them. Search snippets when you need them. Everything in sync." },
        ].map((s) => (
          <div key={s.num} className="flex gap-4 items-start p-5 sm:p-8 dark:bg-[#080c0a] bg-card dark:hover:bg-[#0f1510] hover:bg-background transition-colors">
            <div className="w-10 h-10 rounded-full border border-green-400/30 flex items-center justify-center font-mono text-xs text-green-400 flex-shrink-0">{s.num}</div>
            <div>
              <span className="inline-block bg-green-400/8 border border-green-400/15 text-green-400 font-mono text-xs px-2 py-0.5 rounded mb-2">{s.tag}</span>
              <h3 className="font-bold text-lg mb-1 text-black dark:text-white">{s.title}</h3>
              <p className="text-text-text-muted text-sm leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
      </section >

    <section id='pricing' className='scroll-mt-20 px-5 sm:px-8'>
        <PricingPage/>
    </section>

  {/* FOOTER */ }
  <footer className = "border-t border-border px-5 pt-12 pb-8 sm:px-8" >
    <div className="mx-auto mb-12 grid max-w-6xl gap-8 sm:grid-cols-3">
      {/* Brand */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-green-400 font-mono text-lg font-medium">StackMind</span>
        </div>
        <p className="text-text-text-muted text-sm leading-relaxed max-w-xs">
          A second brain for developers. Notes, bugs, and snippets — organized and searchable with AI.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 text-xs font-mono text-black bg-card dark:text-text-text-muted dark:bg-zinc-900 border border-border rounded-lg px-3 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          Built with Next.js · Claude · Qdrant
        </div>
      </div>

      {/* Product */}
      <div>
        <p className="text-xs font-medium tracking-widest uppercase text-text-text-muted mb-4">Product</p>
        <ul className="flex flex-col gap-2">
          {[
            { label: 'Notes', href: '#notes' },
            { label: 'Bug Tracker', href: '#bug-tracker' },
            { label: 'Snippets', href: '#snippets' },
            { label: 'AI Search', href: '#ai-search' },
          ].map(({ label, href }) => (
            <li key={href}>
              <a href={href} className="text-sm text-text-text-muted hover:text-text-muted">{label}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* Developer */}
      <div>
        <p className="text-xs font-medium tracking-widest uppercase text-text-text-muted mb-4">Developer</p>
        <ul className="flex flex-col gap-2">
          <li><a href="https://github.com/ApurvaChoudhary45/StackMind" target="_blank" rel="noopener noreferrer" className="text-sm text-text-text-muted hover:text-green-400 cursor-pointer ">GitHub</a></li>
          <li className="text-sm text-text-text-muted hover:text-green-400 cursor-pointer  "><Link href={`/changelog`}>Changelog</Link></li>
          <li className="text-sm text-text-text-muted hover:text-green-400 cursor-pointer  "><Link href={`/privacy`}>Privacy</Link></li>
          <li className="text-sm text-text-text-muted hover:text-green-400 cursor-pointer  "><Link href={`/TermsPage`}>Terms of Service</Link></li>
          <li className="text-sm text-text-text-muted hover:text-green-400 cursor-pointer  "><Link href={`/refund`}>Refund Policy</Link></li>
          <li className="text-sm text-text-text-muted hover:text-green-400 cursor-pointer  "><Link href={`/contact`}>Contact</Link></li>

        </ul>
      </div>
    </div>

{/* Bottom */ }
<div className="mx-auto flex max-w-6xl items-center border-t border-border pt-6">
  <span className="text-xs font-mono text-text-text-muted">// © 2026 StackMind — all rights reserved</span>
</div>
      </footer >

    </main >
  )
}

export default LandingPage


