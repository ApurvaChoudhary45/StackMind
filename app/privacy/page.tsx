export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-foreground">
      <h1 className="text-4xl font-bold text-green-400 mb-8">
        Privacy Policy
      </h1>

      <div className="space-y-8 text-muted-foreground leading-8">

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Information We Collect
          </h2>
          <p>
            StackMind collects information you provide when creating an
            account, including your name, email address, projects, notes,
            snippets, bug reports and AI interactions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            How We Use Your Information
          </h2>
          <p>
            We use your information to provide our services, improve product
            quality, process payments, authenticate users, and deliver AI
            features.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Data Security
          </h2>
          <p>
            We implement industry standard security measures to protect your
            information. However, no online platform can guarantee complete
            security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Third Party Services
          </h2>
          <p>
            StackMind uses trusted third-party providers including Supabase,
            Razorpay, OpenAI and other infrastructure providers to operate the
            platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Contact
          </h2>
          <p>
            For privacy related questions please contact us at
            support@stackmind.dev.
          </p>
        </section>

      </div>
    </main>
  )
}