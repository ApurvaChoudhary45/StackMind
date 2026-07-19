'use client'

import Link from 'next/link'
import TerminalAnimation from './TerminalAnimation'
import ThemeToggle from './Toggle'
import DarkMode from './DarkMode'

const LandingPage = () => {
  return (
    <main className="bg-background dark:bg-black text-white min-h-screen font-sans">

      {/* NAV */}
      <nav className="flex justify-between items-center md:px-10 py-5 px-4 border-b border-green-400/10 sticky top-0 dark:bg-[#080c0a]/90 backdrop-blur-md z-50 bg-card">
        <span className="font-mono text-green-400 md:text-lg">Stack<span className="text-gray-500">//</span>Mind</span>
        <div className="flex items-center md:gap-8 gap-5">
          <DarkMode/>
          <a href="#features" className="text-gray-500 hover:text-green-400 md:text-sm uppercase tracking-widest transition-colors text-xs">Features</a>
          <a href="#how" className="text-gray-500 hover:text-green-400 md:text-sm uppercase tracking-widest transition-colors text-xs">How it works</a>

          <Link href="/Login" className="bg-green-400 text-black font-mono font-bold md:text-sm md:px-5 md:py-2 rounded hover:opacity-80 transition-opacity text-sm py-2 px-1 md:block ">
            Start
          </Link>

        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-[88vh] flex items-center px-10 md:py-20 py-8 relative">
        <div className="md:grid grid-cols-2 gap-16 items-center max-w-5xl mx-auto w-full">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-400/8 border border-green-400/15 rounded-full px-4 py-1.5 font-mono text-xs text-green-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              Built for developers, by developers
            </div>
            <h1 className="md:text-6xl text-3xl font-extrabold leading-[1.05] tracking-tight mb-5 dark:text-white text-black">
              Your second <span className="text-green-400">brain</span><br />for dev projects
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
              Notes with syntax highlighting, bug tracking, and a searchable code snippet library — all in one place.
            </p>
            <div className="flex gap-4 items-center">
              <Link href="/Login" className="bg-green-400 text-black font-mono font-bold md:px-6 md:py-3 px-2 py-2 rounded hover:opacity-85 transition-opacity">
                Start for free →
              </Link>
              <a href="#features" className="text-green-400 border border-green-400/30 font-mono text-sm px-6 py-3 rounded hover:bg-green-400/10 transition-colors">
                See features
              </a>
            </div>
            <p className="font-mono text-xs text-gray-600 mt-4">// Free to start. No credit card required.</p>
          </div>

          {/* TERMINAL */}
          <TerminalAnimation />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="dark:bg-[#0f1510] border-y border-green-400/10 px-10 py-20 bg-card">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-xs text-green-400 tracking-widest uppercase mb-3">// Features</p>
          <h2 className="text-4xl font-extrabold tracking-tight mb-3 dark:text-white text-black">Everything a dev brain needs</h2>
          <p className="text-gray-500 mb-12 max-w-lg">Not another generic tool. Built around how developers actually think.</p>
          <div className="md:grid grid-cols-3 gap-px dark:bg-green-400/10 border dark:border-green-400/10 border-border rounded-xl overflow-hidden">
            {[
              { icon: "🧠", title: "Ask your notes anything", desc: "RAG-powered AI search across all your notes. Ask why a bug happened last week — it knows." },
              { icon: "🤖", title: "AI bug analyzer", desc: "Describe a bug, get a diagnosis. Powered by Claude with full context from your project notes." },
              { icon: "📝", title: "Rich notes + code blocks", desc: "Syntax-highlighted code blocks for 30+ languages. Your docs live where you work." },
              { icon: "🐛", title: "Kanban bug tracker", desc: "Drag bugs across Open → In Progress → Fixed with real-time sync." },
              { icon: "📌", title: "Snippet library", desc: "Save, tag, and search reusable code. Never rewrite the same utility twice." },
              { icon: "🗂️", title: "Project workspaces", desc: "Each project has its own notes, bugs, and snippets — fully isolated." },
              { icon: "⚡", title: "VS Code extension", desc: "Dark mode toggle, GitHub API integration, and productivity shortcuts right inside your editor." },
              { icon: "💻", title: "CLI tool", desc: "Terminal-first workflow with repo integrations, task automation, and lightweight scaffolding." },
              { icon: "📓", title: "Daily journal", desc: "Log milestones, experiments, and bug fixes. Share progress publicly or keep it private." }
            ].map((f) => (
              <div key={f.title} className="dark:bg-[#0f1510] bg-background p-8 dark:hover:bg-[#161d17] hover:bg-green-300/60 transition-colors">
                <div className="text-2xl mb-4">{f.icon}</div>
                <h3 className="font-bold mb-2 dark:text-white text-black">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="px-10 py-20">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-xs text-green-400 tracking-widest uppercase mb-3">// How it works</p>
          <h2 className="text-4xl font-extrabold tracking-tight mb-3 dark:text-white text-black">Up and running in 3 minutes</h2>
          <p className="text-gray-500 mb-12 max-w-lg">No config files. No setup headaches. Sign in and start building.</p>
          <div className="flex flex-col divide-y divide-green-400/10 border border-green-400/10 rounded-xl overflow-hidden">
            {[
              { num: "01", tag: "auth", title: "Sign in with GitHub", desc: "One click, zero passwords. Your account is tied to your GitHub identity." },
              { num: "02", tag: "organize", title: "Create a project workspace", desc: "Give it a name and description. Each project gets its own isolated workspace." },
              { num: "03", tag: "capture", title: "Write notes, track bugs, save snippets", desc: "Start capturing ideas, logging bugs, saving that utility function you keep rewriting." },
              { num: "04", tag: "ship", title: "Move fast, stay organized", desc: "Drag bugs as you fix them. Search snippets when you need them. Everything in sync." },
            ].map((s) => (
              <div key={s.num} className="flex gap-6 items-start p-8 dark:bg-[#080c0a] bg-card dark:hover:bg-[#0f1510] hover:bg-green-300/60 transition-colors">
                <div className="w-10 h-10 rounded-full border border-green-400/30 flex items-center justify-center font-mono text-xs text-green-400 flex-shrink-0">{s.num}</div>
                <div>
                  <span className="inline-block bg-green-400/8 border border-green-400/15 text-green-400 font-mono text-xs px-2 py-0.5 rounded mb-2">{s.tag}</span>
                  <h3 className="font-bold text-lg mb-1 text-black dark:text-white">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-10 py-24 dark:bg-[#0f1510] bg-card border-t border-green-400/10">
        <p className="font-mono text-xs text-green-400 tracking-widest uppercase mb-4">// Get started</p>
        <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-black dark:text-white">Your dev brain deserves better</h2>
        <p className="text-gray-500 mb-8">Free forever. Sign in with GitHub and start in 30 seconds.</p>
        <Link href="/Login" className="bg-green-400 text-black font-mono font-bold px-8 py-3 rounded hover:opacity-85 transition-opacity text-sm">
          Start for free →
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="px-8 pt-12 pb-8 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-green-400 font-mono text-lg font-medium">StackMind</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              A second brain for developers. Notes, bugs, and snippets — organized and searchable with AI.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 text-xs font-mono text-black bg-card dark:text-gray-500 dark:bg-zinc-900 border border-border rounded-lg px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Built with Next.js · Claude · Qdrant
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-gray-600 mb-4">Product</p>
            <ul className="flex flex-col gap-2">
              {['Notes', 'Bug Tracker', 'Snippets', 'AI Search'].map(link => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-400 cursor-auto">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer */}
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-gray-600 mb-4">Developer</p>
            <ul className="flex flex-col gap-2">
              <li><a href="https://github.com/ApurvaChoudhary45/StackMind" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-green-400 cursor-pointer ">Github</a></li>
              <li className="text-sm text-gray-400 hover:text-green-400 cursor-pointer  "><Link href={`/changelog`}>Changelog</Link></li>
              <li className="text-sm text-gray-400 hover:text-green-400 cursor-pointer  "><Link href={`/privacy`}>Privacy</Link></li>

            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex justify-between items-center pt-6 border-t border-border">
          <span className="text-xs font-mono text-gray-600">// © 2026 StackMind — all rights reserved</span>
          <div className="flex gap-3">
            {/* Add your social links here */}
          </div>
        </div>
      </footer>

    </main>
  )
}

export default LandingPage


