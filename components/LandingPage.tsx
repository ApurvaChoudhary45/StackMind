'use client'

import Link from 'next/link'

const LandingPage = () => {
  return (
     <main className="bg-black text-white min-h-screen font-sans">

      {/* NAV */}
      <nav className="flex justify-between items-center md:px-10 py-5 px-3 border-b border-green-400/10 sticky top-0 bg-[#080c0a]/90 backdrop-blur-md z-50">
        <span className="font-mono text-green-400 md:text-lg">Stack<span className="text-gray-500">//</span>Mind</span>
        <div className="flex items-center md:gap-8 gap-2">
          <a href="#features" className="text-gray-500 hover:text-green-400 md:text-sm uppercase tracking-widest transition-colors text-xs">Features</a>
          <a href="#how" className="text-gray-500 hover:text-green-400 md:text-sm uppercase tracking-widest transition-colors text-xs">How it works</a>
          <Link href="/Login" className="bg-green-400 text-black font-mono font-bold md:text-sm md:px-5 md:py-2 rounded hover:opacity-80 transition-opacity text-xs py-2 px-1">
            Get started →
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
            <h1 className="md:text-6xl text-3xl font-extrabold leading-[1.05] tracking-tight mb-5">
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
            <p className="font-mono text-xs text-gray-600 mt-4">// No credit card required. Free forever.</p>
          </div>

          {/* TERMINAL */}
          <div className="bg-[#0f1510] border border-green-400/12 rounded-xl overflow-hidden font-mono text-xs">
            <div className="bg-[#161d17] px-4 py-3 flex items-center gap-2 border-b border-green-400/10">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]"></span>
              <span className="w-3 h-3 rounded-full bg-[#febc2e]"></span>
              <span className="w-3 h-3 rounded-full bg-[#28c840]"></span>
              <span className="text-gray-600 text-xs ml-2">stackmind — dashboard</span>
            </div>
            <div className="p-5 leading-8">
              <div><span className="text-green-400">→ </span><span className="text-blue-300">project.notes.create</span></div>
              <div className="text-gray-600">// Title: Auth bug investigation</div>
              <div className="text-gray-600">// Adding code block...</div>
              <br />
              <div><span className="text-green-400">→ </span><span className="text-blue-300">bugs.move</span><span className="text-gray-600">( "fix JWT expiry" )</span></div>
              <div className="text-yellow-300">  status: "open" → "fixed"</div>
              <div className="text-green-400">  ✓ synced in real-time</div>
              <br />
              <div><span className="text-green-400">→ </span><span className="text-blue-300">snippets.save</span></div>
              <div className="text-gray-600">// tags: ["auth", "jwt", "utils"]</div>
              <div className="text-green-400">  ✓ saved to library</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-[#0f1510] border-y border-green-400/10 px-10 py-20">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-xs text-green-400 tracking-widest uppercase mb-3">// Features</p>
          <h2 className="text-4xl font-extrabold tracking-tight mb-3">Everything a dev brain needs</h2>
          <p className="text-gray-500 mb-12 max-w-lg">Not another generic tool. Built around how developers actually think.</p>
          <div className="md:grid grid-cols-3 gap-px bg-green-400/10 border border-green-400/10 rounded-xl overflow-hidden">
            {[
              { icon: "📝", title: "Rich notes + code blocks", desc: "Syntax-highlighted code blocks for 30+ languages. Your docs live where you work." },
              { icon: "🐛", title: "Kanban bug tracker", desc: "Drag bugs across Open → In Progress → Fixed with real-time sync." },
              { icon: "📌", title: "Snippet library", desc: "Save, tag, and search reusable code. Never rewrite the same utility twice." },
              { icon: "⚡", title: "Real-time collaboration", desc: "Changes sync live. Your teammate sees the board update instantly." },
              { icon: "🔐", title: "Secure by default", desc: "Row Level Security + GitHub OAuth. No passwords, no friction." },
              { icon: "🗂️", title: "Project workspaces", desc: "Each project has its own notes, bugs, and snippets — fully isolated." },
            ].map((f) => (
              <div key={f.title} className="bg-[#0f1510] p-8 hover:bg-[#161d17] transition-colors">
                <div className="text-2xl mb-4">{f.icon}</div>
                <h3 className="font-bold mb-2">{f.title}</h3>
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
          <h2 className="text-4xl font-extrabold tracking-tight mb-3">Up and running in 3 minutes</h2>
          <p className="text-gray-500 mb-12 max-w-lg">No config files. No setup headaches. Sign in and start building.</p>
          <div className="flex flex-col divide-y divide-green-400/10 border border-green-400/10 rounded-xl overflow-hidden">
            {[
              { num: "01", tag: "auth", title: "Sign in with GitHub", desc: "One click, zero passwords. Your account is tied to your GitHub identity." },
              { num: "02", tag: "organize", title: "Create a project workspace", desc: "Give it a name and description. Each project gets its own isolated workspace." },
              { num: "03", tag: "capture", title: "Write notes, track bugs, save snippets", desc: "Start capturing ideas, logging bugs, saving that utility function you keep rewriting." },
              { num: "04", tag: "ship", title: "Move fast, stay organized", desc: "Drag bugs as you fix them. Search snippets when you need them. Everything in sync." },
            ].map((s) => (
              <div key={s.num} className="flex gap-6 items-start p-8 bg-[#080c0a] hover:bg-[#0f1510] transition-colors">
                <div className="w-10 h-10 rounded-full border border-green-400/30 flex items-center justify-center font-mono text-xs text-green-400 flex-shrink-0">{s.num}</div>
                <div>
                  <span className="inline-block bg-green-400/8 border border-green-400/15 text-green-400 font-mono text-xs px-2 py-0.5 rounded mb-2">{s.tag}</span>
                  <h3 className="font-bold text-lg mb-1">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-10 py-24 bg-[#0f1510] border-t border-green-400/10">
        <p className="font-mono text-xs text-green-400 tracking-widest uppercase mb-4">// Get started</p>
        <h2 className="text-4xl font-extrabold tracking-tight mb-4">Your dev brain deserves better</h2>
        <p className="text-gray-500 mb-8">Free forever. Sign in with GitHub and start in 30 seconds.</p>
        <Link href="/Login" className="bg-green-400 text-black font-mono font-bold px-8 py-3 rounded hover:opacity-85 transition-opacity text-sm">
          Start for free →
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-green-400/10 bg-[#0f1510] px-10 py-8">
        <div className="max-w-5xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <div>
            <div className="font-mono text-green-400">Stack<span className="text-gray-600">//</span>Mind</div>
            <div className="text-gray-600 text-xs mt-1">Second brain for developers.</div>
          </div>
          <div className="flex gap-6">
            <a href="#features" className="text-gray-500 hover:text-green-400 text-sm transition-colors">Features</a>
            <a href="#how" className="text-gray-500 hover:text-green-400 text-sm transition-colors">How it works</a>
            <a href="#" className="text-gray-500 hover:text-green-400 text-sm transition-colors">GitHub</a>
          </div>
          <div className="font-mono text-xs text-gray-600">// built with Next.js + Supabase</div>
        </div>
      </footer>

    </main>
  )
}

export default LandingPage


