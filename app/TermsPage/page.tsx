export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">

      <h1 className="text-4xl font-bold text-green-400 mb-8">
        Terms of Service
      </h1>

      <div className="space-y-8 text-muted-foreground leading-8">

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Acceptance
          </h2>
          <p>
            By using StackMind you agree to these terms and conditions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            User Responsibilities
          </h2>
          <p>
            Users are responsible for maintaining the confidentiality of their
            account credentials and the content they upload.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Subscription
          </h2>
          <p>
            StackMind offers Free and Pro plans. Subscription fees are billed
            through Razorpay. Features vary by plan.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Termination
          </h2>
          <p>
            We reserve the right to suspend or terminate accounts violating
            these terms.
          </p>
        </section>

      </div>

    </main>
  )
}