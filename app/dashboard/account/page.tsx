// app/dashboard/account/page.tsx

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Disconnect from '@/components/Disconnect'
import ProviderLogin from '@/components/ProviderLogin'
import DeleteAccount from '@/components/DeleteAccount'

export default async function AccountPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/Login')

    const avatar = user.user_metadata?.avatar_url
    const fullName = user.user_metadata?.full_name ?? user.email?.split('@')[0]
    const memberSince = new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    const currentProvider = user?.app_metadata.provider

    const provider = user?.identities ?? []

    const hasGithub = provider.some(i => i.provider === 'github')
    const hasGoogle = provider.some(i => i.provider === 'google')

    const canDisconnect = (user?.identities?.length ?? 0) > 1

    return (
        <div className="p-8 bg-black/90 min-h-screen ">
            <p className="font-mono text-sm text-zinc-600 mb-8">
                // <span className="text-green-400">account</span> settings
            </p>

            {/* Profile Section */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl mb-3 overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-900">
                    <p className="text-sm font-medium text-zinc-200">Profile</p>
                    <p className="text-xs font-mono text-zinc-600 mt-0.5">Your public profile information</p>
                </div>
                <div className="p-5">
                    {/* Avatar + Info */}
                    <div className="flex items-center gap-4">
                        {avatar ? (
                            <img
                                src={avatar}
                                alt="Avatar"
                                width={56}
                                height={56}
                                className="rounded-full border-2 border-green-400/20"
                            />
                        ) : (
                            <div className="w-14 h-14 rounded-full bg-green-950 border-2 border-green-400/20 flex items-center justify-center text-green-400 font-mono text-lg font-medium">
                                {fullName?.slice(0, 2).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-zinc-200">{fullName}</p>
                            <p className="text-xs font-mono text-zinc-600">{user.email}</p>
                            <span className="inline-flex items-center gap-1 text-xs font-mono text-green-400 bg-green-950/50 border border-green-400/10 px-2 py-0.5 rounded-full mt-1.5">
                                {currentProvider === 'github' ? <i className="ti ti-brand-github text-xs" /> : <i className="ti ti-brand-google text-xs" />}
                                {currentProvider === 'github' ? 'Github' : 'Google'} account
                            </span>
                        </div>
                    </div>

                    {/* Fields */}
                    <div className="mt-5 pt-4 border-t border-zinc-900">
                        {[
                            { label: 'display_name', value: fullName },
                            { label: 'email', value: user.email },
                            { label: 'member_since', value: memberSince },
                        ].map(field => (
                            <div key={field.label} className="flex justify-between items-center py-3 border-b border-zinc-900 last:border-b-0 last:pb-0">
                                <span className="text-xs font-mono text-zinc-600">{field.label}</span>
                                <span className="text-xs font-mono text-zinc-500">{field.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Connected Accounts */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl mb-3 overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-900">
                    <p className="text-sm font-medium text-zinc-200">Connected Accounts</p>
                    <p className="text-xs font-mono text-zinc-600 mt-0.5">Manage your third party connections</p>
                </div>
                <div className="p-5 flex flex-col gap-4">
                    {/* Google */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                                <i className="ti ti-brand-google text-base" />
                            </div>
                            <div>
                                <p className="text-sm text-zinc-300 font-medium">Google</p>
                                {hasGoogle ? <p className="text-xs font-mono text-green-400">● connected</p> : <p className="text-xs font-mono text-zinc-600">○ not connected</p>}
                            </div>
                        </div>
                        {hasGoogle ? (
                            canDisconnect ? (
                                <Disconnect provider="google" />
                            ) : (
                                <div className="relative group">
                                    <button
                                        disabled
                                        className="text-xs font-mono text-zinc-700 border border-zinc-900 px-3 py-1.5 rounded-lg cursor-not-allowed opacity-50"
                                    >
                                        Disconnect
                                    </button>
                                    <div className="absolute right-0 bottom-8 bg-zinc-800 text-zinc-300 text-xs font-mono px-2 py-2 rounded-lg border border-zinc-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-100">
                                        Connect another provider first before disconnecting
                                    </div>
                                </div>
                            )
                        ) : (
                            <ProviderLogin provider='google' />
                        )}
                    </div>

                    {/* GitHub */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                                <i className="ti ti-brand-github text-base" />
                            </div>
                            <div>
                                <p className="text-sm text-zinc-300 font-medium">GitHub</p>
                                {hasGithub ? <p className="text-xs font-mono text-green-400">● connected</p> : <p className="text-xs font-mono text-zinc-600">○ not connected</p>}
                            </div>
                        </div>
                        {hasGithub ? (
                            canDisconnect ? (
                                <Disconnect provider="github" />
                            ) : (
                                <div className="relative group">
                                    <button
                                        disabled
                                        className="text-xs font-mono text-zinc-700 border border-zinc-900 px-3 py-1.5 rounded-lg cursor-not-allowed opacity-50"
                                    >
                                        Disconnect
                                    </button>
                                    <div className="absolute right-0 bottom-8 bg-zinc-800 text-zinc-300 text-xs font-mono px-2 py-2 rounded-lg border border-zinc-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-52">
                                        Connect another provider first before disconnecting
                                    </div>
                                </div>
                            )
                        ) : (
                            <ProviderLogin provider='github' />
                        )}
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-zinc-950 border border-red-400/10 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-red-400/10">
                    <p className="text-sm font-medium text-red-400">Danger Zone</p>
                    <p className="text-xs font-mono text-zinc-600 mt-0.5">Irreversible actions — proceed with caution</p>
                </div>
                <div className="p-5">
                    <p className="text-xs font-mono text-zinc-600 mb-3">
                        Deleting your account will remove all projects, notes, bugs and snippets permanently.
                    </p>
                    <DeleteAccount />
                </div>
            </div>
        </div>
    )
}