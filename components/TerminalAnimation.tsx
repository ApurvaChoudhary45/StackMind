"use client";

import { useEffect, useRef, useState } from "react";

// ── TYPES ──────────────────────────────────────────────────────────────────
type LineType = "input" | "success" | "muted" | "ai" | "highlight" | "blank";

interface TerminalLine {
  text: string;
  type: LineType;
}

// ── TERMINAL SCRIPT ────────────────────────────────────────────────────────
const LINES: TerminalLine[] = [
  { text: "# Welcome to StackMind", type: "muted" },
  { text: "", type: "blank" },
  { text: 'notes.create("JWT auth bug investigation")', type: "input" },
  { text: "✓ Note created with syntax highlighting", type: "success" },
  { text: "  → Added to: Backend / Auth Project", type: "muted" },
  { text: "", type: "blank" },
  { text: 'ai.ask("why did JWT keep expiring?")', type: "input" },
  { text: "⠋ Searching your notes with RAG...", type: "muted" },
  { text: '✓ Found match in "JWT auth bug investigation"', type: "success" },
  { text: "→ Token expiry was set to 1s instead of 1h", type: "ai" },
  { text: "", type: "blank" },
  { text: 'snippets.save("jwt-utils.js", ["auth","jwt"])', type: "input" },
  { text: "✓ Saved to snippet library — never rewrite it again", type: "success" },
  { text: "# Your dev brain. Finally organised. 🧠", type: "muted" },
];

const TYPE_SPEED = 48;
const LINE_PAUSE = 500;
const PROMPT_PAUSE = 850;

// ── STYLE MAP ──────────────────────────────────────────────────────────────
const typeStyles: Record<LineType, string> = {
  input:     "text-blue-400 before:content-['❯_'] before:font-bold",
  success:   "text-green-400",
  muted:     "text-zinc-500",
  ai:        "text-purple-300",
  highlight: "text-red-400",
  blank:     "select-none",
};

// ── COMPONENT ──────────────────────────────────────────────────────────────
export default function TerminalAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const runningRef   = useRef<boolean>(false);
  const [showReplay, setShowReplay] = useState<boolean>(false);

  const sleep = (ms: number): Promise<void> =>
    new Promise((r) => setTimeout(r, ms));

  const runAnimation = async (): Promise<void> => {
    const container = containerRef.current;
    if (!container || runningRef.current) return;

    runningRef.current = true;
    setShowReplay(false);
    container.innerHTML = "";

    for (const line of LINES) {
      if (!containerRef.current) return; // component unmounted

      const el = document.createElement("span") as HTMLSpanElement;
      el.className = `block font-mono text-sm leading-7 whitespace-pre-wrap ${
        typeStyles[line.type] ?? "text-zinc-200"
      }`;

      if (line.type === "blank") {
        el.innerHTML = "&nbsp;";
        container.appendChild(el);
        await sleep(LINE_PAUSE * 0.4);
        continue;
      }

      container.appendChild(el);

      if (line.type === "input") {
        for (let i = 0; i <= line.text.length; i++) {
          el.textContent = line.text.slice(0, i);
          await sleep(TYPE_SPEED + Math.random() * 16);
        }
        await sleep(PROMPT_PAUSE);
      } else {
        el.textContent = line.text;
        await sleep(LINE_PAUSE);
      }
    }

    runningRef.current = false;
    setShowReplay(true);
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting) {
          runAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden border border-zinc-700/60 shadow-2xl shadow-black/40"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-b border-zinc-700/60">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-400" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-3 text-xs text-zinc-500 font-mono">
          stackmind — second brain
        </span>
      </div>

      {/* Terminal body */}
      <div className="bg-zinc-950 px-5 py-6 min-h-[300px]">
        <div ref={containerRef} />

        {/* Blinking cursor */}
        {!showReplay && (
          <span className="inline-block w-2 h-4 bg-blue-400 ml-0.5 animate-pulse" />
        )}

        {/* Replay button */}
        {showReplay && (
          <button
            onClick={runAnimation}
            className="mt-4 text-xs text-zinc-500 border border-zinc-700 rounded px-3 py-1 font-mono hover:text-zinc-300 hover:border-blue-500 transition-colors"
          >
            ↺ replay
          </button>
        )}
      </div>
    </div>
  );
}