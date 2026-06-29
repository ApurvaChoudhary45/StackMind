"use client";

// ── COMPONENT ──────────────────────────────────────────────────────────────
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-20">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-14">
          <p className="text-sm font-mono text-green-400 mb-3">stackmind</p>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-zinc-500 text-sm">Last updated: June 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-12 text-zinc-300 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              1. Who we are
            </h2>
            <p>
              StackMind is a developer productivity tool that helps you manage
              notes, snippets, and bugs in one place. We are committed to
              protecting your privacy and being transparent about how we handle
              your data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              2. What data we collect
            </h2>
            <p className="mb-4">We collect only what is necessary to run the service:</p>
            <ul className="space-y-2 pl-4 border-l border-zinc-700">
              <li>
                <span className="text-white font-medium">Account information</span> —
                your name and email address from Google or GitHub OAuth login.
              </li>
              <li>
                <span className="text-white font-medium">Content you create</span> —
                notes, snippets, and bugs you save inside StackMind.
              </li>
              <li>
                <span className="text-white font-medium">GitHub integration data</span> —
                repository information you choose to connect, accessed only with
                your explicit permission.
              </li>
              <li>
                <span className="text-white font-medium">Usage data</span> —
                basic analytics like page views and feature usage to help us
                improve the product. No personal identifiers are attached.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              3. How we use your data
            </h2>
            <ul className="space-y-2 pl-4 border-l border-zinc-700">
              <li>To provide and operate StackMind</li>
              <li>To power AI features like RAG search and bug analysis</li>
              <li>To sync your data across devices</li>
              <li>To send important product updates (no marketing spam)</li>
              <li>To improve the product based on usage patterns</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              4. AI and your data
            </h2>
            <p className="mb-3">
              StackMind uses AI to power features like note search and bug
              analysis. Your content is sent to AI providers (such as Anthropic's
              Claude) to generate responses.
            </p>
            <p>
              We do not use your notes, snippets, or bugs to train AI models.
              Your content is used solely to generate responses for you in real
              time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              5. Data sharing
            </h2>
            <p className="mb-3">
              We do not sell your data. Ever. We share data only with:
            </p>
            <ul className="space-y-2 pl-4 border-l border-zinc-700">
              <li>
                <span className="text-white font-medium">AI providers</span> —
                to process your queries (e.g. Anthropic, OpenAI depending on
                your provider settings)
              </li>
              <li>
                <span className="text-white font-medium">Infrastructure providers</span> —
                such as Vercel (hosting) and Qdrant (vector storage)
              </li>
              <li>
                <span className="text-white font-medium">GitHub</span> —
                only if you enable GitHub integration
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              6. Data storage and security
            </h2>
            <p>
              Your data is stored securely. We use industry-standard encryption
              in transit (HTTPS) and at rest. Access to production data is
              strictly limited.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              7. Your rights
            </h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="space-y-2 pl-4 border-l border-zinc-700">
              <li>Access all data we hold about you</li>
              <li>Export your notes, snippets, and bugs at any time</li>
              <li>Delete your account and all associated data</li>
              <li>Opt out of analytics</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, contact us at{" "}
              <a
                href="mailto:privacy@stackmind.dev"
                className="text-blue-400 hover:underline"
              >
                privacy@stackmind.dev
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              8. Cookies
            </h2>
            <p>
              We use only essential cookies required for authentication and
              session management. We do not use advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              9. Changes to this policy
            </h2>
            <p>
              If we make significant changes to this policy, we will notify you
              via email or an in-app notice before the changes take effect.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              10. Contact
            </h2>
            <p>
              Questions about privacy? Reach us at{" "}
              <a
                href="mailto:privacy@stackmind.dev"
                className="text-blue-400 hover:underline"
              >
                privacy@stackmind.dev
              </a>
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-zinc-800 text-sm text-zinc-500">
          <p>StackMind — Built for developers, by a developer.</p>
        </div>

      </div>
    </main>
  );
}