export default function RefundPolicy() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">

      <h1 className="text-4xl font-bold text-green-400 mb-8">
        Refund Policy
      </h1>

      <div className="space-y-8 text-muted-foreground leading-8">

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Subscription Refunds
          </h2>

          <p>
            Refund requests made within 7 days of the initial subscription
            purchase may be reviewed on a case-by-case basis.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Cancellation
          </h2>

          <p>
            You may cancel your subscription at any time. Your Pro benefits
            remain active until the current billing period ends unless a refund
            is approved.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Contact
          </h2>

          <p>
            Email support@stackmind.dev with your payment ID for refund
            requests.
          </p>
        </section>

      </div>

    </main>
  )
}