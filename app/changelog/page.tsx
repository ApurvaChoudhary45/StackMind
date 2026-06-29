"use client";

// ── CHANGELOG DATA ─────────────────────────────────────────────────────────
// Add new entries at the TOP of this array (newest first)
const changelog = [
  {
    version: "v1.0.0",
    date: "June 2026",
    label: "Launch",
    labelColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    changes: [
      {
        type: "new",
        text: "Notes with syntax highlighting across 30+ programming languages",
      },
      {
        type: "new",
        text: "RAG-powered AI search — ask questions about your notes and get answers",
      },
      {
        type: "new",
        text: "Snippet library — save, tag, and search reusable code snippets",
      },
      {
        type: "new",
        text: "Real-time Kanban board for bug tracking",
      },
      {
        type: "new",
        text: "AI-powered bug analyzer to diagnose issues from your descriptions",
      },
      {
        type: "new",
        text: "GitHub integration — link bugs and notes to your repos",
      },
      {
        type: "new",
        text: "Multiple AI provider support — bring your own keys",
      },
      {
        type: "new",
        text: "Global search across notes, snippets, and bugs",
      },
      {
        type: "new",
        text: "Google and GitHub OAuth login",
      },
    ],
  },
];

// ── CHANGE TYPE STYLES ─────────────────────────────────────────────────────
const changeTypeStyles: Record<string, string> = {
  new:  "text-green-400 before:content-['✦']",
  fix:  "text-yellow-400 before:content-['⚒']",
  improvement: "text-blue-400 before:content-['↑']",
  removed: "text-red-400 before:content-['✕']",
};

// ── COMPONENT ──────────────────────────────────────────────────────────────
export default function Changelog() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-20">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <p className="text-sm font-mono text-green-400 mb-3">stackmind</p>
          <h1 className="text-4xl font-bold text-white mb-4">Changelog</h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            Every update, improvement, and fix — in one place.
            Follow along as StackMind gets better every week.
          </p>
        </div>

        {/* Entries */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 top-2 bottom-0 w-px bg-zinc-800" />

          <div className="space-y-16">
            {changelog.map((entry) => (
              <div key={entry.version} className="relative pl-8">

                {/* Dot on timeline */}
                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-blue-500 -translate-x-[3.5px]" />

                {/* Version + date */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="text-xl font-bold text-white font-mono">
                    {entry.version}
                  </span>
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded border ${entry.labelColor}`}
                  >
                    {entry.label}
                  </span>
                  <span className="text-sm text-zinc-500">{entry.date}</span>
                </div>

                {/* Changes */}
                <ul className="space-y-3">
                  {entry.changes.map((change, i) => (
                    <li
                      key={i}
                      className={`flex gap-3 text-sm text-zinc-300 font-mono ${
                        changeTypeStyles[change.type] ?? ""
                      }`}
                    >
                      <span className="mt-0.5 shrink-0 w-4 text-center" />
                      <span>{change.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-20 pt-8 border-t border-zinc-800 text-sm text-zinc-500">
          <p>
            More updates coming soon.{" "}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Follow on GitHub
            </a>{" "}
            to stay in the loop.
          </p>
        </div>

      </div>
    </main>
  );
}