import React from 'react'
import CheckoutButton from './CheckoutButton'

type UpgradePro = {
    showUpgrade: boolean
    upgradeReason : string
    setShowUpgrade: React.Dispatch<React.SetStateAction<boolean | null>>
}

const UpgradeModal = ({showUpgrade, upgradeReason, setShowUpgrade } : UpgradePro) => {
  return (
    <div>
      {showUpgrade && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-3xl border border-green-400/20 bg-card p-8 shadow-2xl">

            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-400/10">
                <i className="ti ti-crown text-4xl text-green-400" />
            </div>

            <h2 className="text-center text-3xl font-bold text-green-400">
                Upgrade to Pro
            </h2>

            <p className="mt-4 text-center text-muted">
                {upgradeReason}
            </p>

            <div className="mt-8 rounded-2xl border border-green-400/20 bg-green-400/5 p-5">

                <h3 className="mb-3 font-semibold text-green-400">
                    Pro includes
                </h3>

                <div className="space-y-3 text-sm">

                    <div className="flex items-center gap-3">
                        <i className="ti ti-check text-green-400" />
                        Unlimited AI Queries
                    </div>

                    <div className="flex items-center gap-3">
                        <i className="ti ti-check text-green-400" />
                        Unlimited Code Reviews
                    </div>

                    <div className="flex items-center gap-3">
                        <i className="ti ti-check text-green-400" />
                        Unlimited Projects
                    </div>

                    <div className="flex items-center gap-3">
                        <i className="ti ti-check text-green-400" />
                        Unlimited Notes, Bugs & Snippets
                    </div>

                    <div className="flex items-center gap-3">
                        <i className="ti ti-check text-green-400" />
                        GitHub Import
                    </div>

                    <div className="flex items-center gap-3">
                        <i className="ti ti-check text-green-400" />
                        Priority AI
                    </div>

                </div>

            </div>

            <div className="mt-8 flex gap-3">

                <button
                    onClick={() => setShowUpgrade(false)}
                    className="flex-1 rounded-xl border border-border py-3 hover:border-green-400"
                >
                    Maybe Later
                </button>

                <CheckoutButton/>

            </div>

        </div>
    </div>
)}
    </div>
  )
}

export default UpgradeModal
