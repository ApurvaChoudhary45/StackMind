// app/dashboard/settings/page.tsx
'use client'

import { useState, useEffect } from 'react'

export default function SettingsPage() {
    const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark')
    const [fontSize, setFontSize] = useState('medium')
    const [compactMode, setCompactMode] = useState(false)
    const [showTags, setShowTags] = useState(true)
    const [autoSave, setAutoSave] = useState(true)
    const [autoTagging, setAutoTagging] = useState(true)
    const [confirmDelete, setConfirmDelete] = useState(true)
    const [defaultLanguage, setDefaultLanguage] = useState('TypeScript')

    const [fontSizes, setfontSize] = useState(0)

    useEffect(() => {
        setfontSize(Number(fontSize))
    }, [fontSize])

    const Toggle = ({ value, onChange }: { value: boolean, onChange: () => void }) => (
        <button
            onClick={onChange}  
            className={`w-9 h-5 rounded-full relative transition-colors flex-shrink-0 ${value ? 'bg-green-400' : 'bg-zinc-800'}`}
        >
            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-all ${value ? 'left-[19px]' : 'left-[3px]'}`} />
        </button>
    )



    return (
        <div className="p-8 bg-black/90 min-h-screen">
            <p className="font-mono text-sm text-zinc-600 mb-8">
                // <span className="text-green-400">settings</span>     
            </p>

            {/* Appearance */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl mb-3 overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-900">
                    <p className="text-sm font-medium text-zinc-200">Appearance</p>
                    <p className="text-xs font-mono text-zinc-600 mt-0.5">Customize how StackMind looks</p>
                </div>

                {/* Theme */}
                <div className="flex justify-between items-center px-5 py-4 border-b border-zinc-900">
                    <div>
                        <p className="text-sm text-zinc-300">Theme</p>
                        <p className="text-xs font-mono text-zinc-600 mt-0.5">Choose your preferred color theme</p>
                    </div>
                    <div className="flex gap-1.5">
                        {(['dark', 'light', 'system'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setTheme(t)}
                                className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors ${
                                    theme === t
                                        ? 'bg-green-950/60 text-green-400 border-green-400/20'
                                        : 'text-zinc-600 border-zinc-800 hover:text-zinc-400'
                                }`}
                            >
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Font size */}
                <div className="flex justify-between items-center px-5 py-4 border-b border-zinc-900">
                    <div>
                        <p className="text-sm text-zinc-300">Font size</p>
                        <p className="text-xs font-mono text-zinc-600 mt-0.5">Applies to notes and snippets editor</p>
                    </div>
                    <select
                        value={fontSize}
                        onChange={e => setFontSize(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 text-zinc-500 text-xs font-mono px-3 py-1.5 rounded-lg outline-none focus:border-green-400/30"
                    >
                        <option value="small">Small (13px)</option>
                        <option value="medium">Medium (15px)</option>
                        <option value="large">Large (17px)</option>
                    </select>
                </div>


            </div>

            {/* Preferences */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl mb-6 overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-900">
                    <p className="text-sm font-medium text-zinc-200">Preferences</p>
                    <p className="text-xs font-mono text-zinc-600 mt-0.5">Customize your workspace behavior</p>
                </div>

                {/* Default language */}
                <div className="flex justify-between items-center px-5 py-4 border-b border-zinc-900">
                    <div>
                        <p className="text-sm text-zinc-300">Default snippet language</p>
                        <p className="text-xs font-mono text-zinc-600 mt-0.5">Pre-select language when creating snippets</p>
                    </div>
                    <select
                        value={defaultLanguage}
                        onChange={e => setDefaultLanguage(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 text-zinc-500 text-xs font-mono px-3 py-1.5 rounded-lg outline-none focus:border-green-400/30"
                    >
                        {['TypeScript', 'JavaScript', 'Python', 'Bash', 'SQL'].map(lang => (
                            <option key={lang}>{lang}</option>
                        ))}
                    </select>
                </div>

                {/* Auto save */}
                <div className="flex justify-between items-center px-5 py-4 border-b border-zinc-900">
                    <div>
                        <p className="text-sm text-zinc-300">Auto-save notes</p>
                        <p className="text-xs font-mono text-zinc-600 mt-0.5">Save notes automatically while typing</p>
                    </div>
                    <Toggle value={autoSave} onChange={() => setAutoSave(!autoSave)} />
                </div>

                {/* Auto tagging */}
                <div className="flex justify-between items-center px-5 py-4 border-b border-zinc-900">
                    <div>
                        <p className="text-sm text-zinc-300">AI auto-tagging</p>
                        <p className="text-xs font-mono text-zinc-600 mt-0.5">Automatically generate tags when saving notes</p>
                    </div>
                    <Toggle value={autoTagging} onChange={() => setAutoTagging(!autoTagging)} />
                </div>

                {/* Confirm delete */}
                <div className="flex justify-between items-center px-5 py-4">
                    <div>
                        <p className="text-sm text-zinc-300">Confirm before delete</p>
                        <p className="text-xs font-mono text-zinc-600 mt-0.5">Show confirmation dialog before deleting</p>
                    </div>
                    <Toggle value={confirmDelete} onChange={() => setConfirmDelete(!confirmDelete)} />
                </div>
            </div>

            {/* Save */}
            <div className="flex justify-end">
                <button className="text-sm font-mono font-medium bg-green-400 text-black px-5 py-2 rounded-lg hover:bg-green-300 transition-colors">
                    Save settings
                </button>
            </div>
        </div>
    )
}