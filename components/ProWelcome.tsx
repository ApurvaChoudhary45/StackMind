'use client'

import Link from 'next/link'

export default function WelcomeProPage() {
    return (
        <div className="min-h-screen dark:bg-black bg-background relative overflow-hidden flex items-center justify-center px-6 py-20">

            {/* Background Glow */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-green-500/10 blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-green-400/5 blur-[100px]" />

            <div className="relative z-10 max-w-4xl w-full">

                {/* Badge */}
                <div className="flex justify-center mb-6">
                    <div className="px-5 py-2 rounded-full border border-green-400/20 dark:bg-green-400/10 bg-green-100 text-green-500 font-mono text-sm">
                        ✨ StackMind Pro Activated
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-center text-5xl md:text-6xl font-black tracking-tight dark:text-white text-gray-900">
                    Welcome to{' '}
                    <span className="text-green-400">
                        StackMind Pro
                    </span>
                </h1>

                <p className="mt-6 text-center max-w-2xl mx-auto text-lg dark:text-zinc-400 text-gray-600 leading-8">
                    You're officially part of the Pro experience.
                    Unlock unlimited productivity, AI-powered workflows,
                    and developer tools built to help you ship faster.
                </p>

                {/* Feature Grid */}

                <div className="grid md:grid-cols-2 gap-6 mt-14">

                    <div className="rounded-2xl border border-green-400/20 dark:bg-zinc-900/60 bg-card backdrop-blur-xl p-6">
                        <div className="w-12 h-12 rounded-xl bg-green-400/10 flex items-center justify-center text-green-400 text-2xl">
                            ♾️
                        </div>

                        <h3 className="mt-5 font-bold text-xl dark:text-white">
                            Unlimited Everything
                        </h3>

                        <p className="mt-2 text-sm dark:text-zinc-400 text-gray-500 leading-7">
                            Create unlimited projects, notes, bugs and snippets
                            without worrying about limits.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-green-400/20 dark:bg-zinc-900/60 bg-card backdrop-blur-xl p-6">
                        <div className="w-12 h-12 rounded-xl bg-green-400/10 flex items-center justify-center text-green-400 text-2xl">
                            🤖
                        </div>

                        <h3 className="mt-5 font-bold text-xl dark:text-white">
                            Unlimited AI
                        </h3>

                        <p className="mt-2 text-sm dark:text-zinc-400 text-gray-500 leading-7">
                            Generate explanations, review code and brainstorm
                            ideas with unlimited AI requests.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-green-400/20 dark:bg-zinc-900/60 bg-card backdrop-blur-xl p-6">
                        <div className="w-12 h-12 rounded-xl bg-green-400/10 flex items-center justify-center text-green-400 text-2xl">
                            📚
                        </div>

                        <h3 className="mt-5 font-bold text-xl dark:text-white">
                            Full History
                        </h3>

                        <p className="mt-2 text-sm dark:text-zinc-400 text-gray-500 leading-7">
                            Access your complete developer journal and every
                            note you've ever created.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-green-400/20 dark:bg-zinc-900/60 bg-card backdrop-blur-xl p-6">
                        <div className="w-12 h-12 rounded-xl bg-green-400/10 flex items-center justify-center text-green-400 text-2xl">
                            ⚡
                        </div>

                        <h3 className="mt-5 font-bold text-xl dark:text-white">
                            Priority Experience
                        </h3>

                        <p className="mt-2 text-sm dark:text-zinc-400 text-gray-500 leading-7">
                            Get access to premium features, faster support,
                            and every future Pro update.
                        </p>
                    </div>

                </div>

                {/* Success Box */}

                <div className="mt-12 rounded-2xl border border-green-400/20 dark:bg-green-400/5 bg-green-100/60 backdrop-blur-xl p-8 text-center">

                    <div className="text-6xl mb-4">
                        🎉
                    </div>

                    <h2 className="text-2xl font-bold dark:text-white">
                        Payment Successful
                    </h2>

                    <p className="mt-3 dark:text-zinc-400 text-gray-600 max-w-xl mx-auto leading-7">
                        Your subscription has been activated successfully.
                        All premium features are now unlocked and ready to use.
                    </p>

                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-3 mt-8 px-8 py-4 rounded-xl bg-green-500 hover:bg-green-400 transition-all duration-300 text-black font-bold shadow-[0_0_40px_rgba(74,222,128,0.25)]"
                    >
                        Go to Dashboard
                        <span>→</span>
                    </Link>

                </div>

                <p className="mt-8 text-center text-xs font-mono dark:text-zinc-600 text-gray-500">
                    Stack<span className="text-green-400">//</span>Mind • Build. Organize. Ship.
                </p>

            </div>
        </div>
    )
}