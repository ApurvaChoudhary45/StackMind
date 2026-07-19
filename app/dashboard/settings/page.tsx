// app/dashboard/settings/page.tsx
'use client'

import { useState, useEffect } from 'react'

import { useTheme } from 'next-themes'

import { redirect } from "next/navigation";
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import CopyTokenButton from '@/components/CopyTokenButton';

export default function SettingsPage() {
    // const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark')
    const { theme, setTheme } = useTheme();
    const [fontSize, setFontSize] = useState('medium')
    // const [compactMode, setCompactMode] = useState(false)
    const [showTags, setShowTags] = useState(true)
    const [autoSave, setAutoSave] = useState<boolean>(false)
    const [autoTagging, setAutoTagging] = useState(true)
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
    const [defaultLanguage, setDefaultLanguage] = useState('TypeScript')

    const [fontSizes, setfontSize] = useState(0)

    const [mounted, setMounted] = useState(false);

    const router = useRouter()

    const supabase = createClient()

    useEffect(() => {
        const checkSession = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login') // redirect if not logged in
            }
        }
        checkSession()
    }, [supabase, router])


    useEffect(() => {
        setfontSize(Number(fontSize))
    }, [fontSize])

    useEffect(() => {
        const item = localStorage.getItem('confirmDelete');
        if (item) setConfirmDelete(item === 'true');

        const saveAuto = localStorage.getItem('autoSaveEnabled')
        if (saveAuto) setAutoSave(saveAuto === 'true')

        const tagAuto = localStorage.getItem('enableTag')
        if (tagAuto) setShowTags(tagAuto === 'true')

        const textSize = localStorage.getItem('fontSize')
        if (textSize) setFontSize(textSize)

        const defaultLang = localStorage.getItem('defaultLanguage')
        if (defaultLang) setDefaultLanguage(defaultLang)
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Avoid rendering until mounted to prevent hydration mismatch
        return null;
    }

    const Toggle = ({ value, onChange }: { value: boolean, onChange: () => void }) => (
        <button
            onClick={onChange}
            className={`w-9 h-5 rounded-full relative transition-colors flex-shrink-0 ${value ? 'bg-green-400' : 'bg-zinc-800'}`}
        >
            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-all ${value ? 'left-[19px]' : 'left-[3px]'}`} />
        </button>
    )

    const saveSettings = () => {
        localStorage.setItem('confirmDelete', String(confirmDelete))
        localStorage.setItem('autoSaveEnabled', String(autoSave))
        localStorage.setItem('enableTag', String(showTags))
        localStorage.setItem('fontSize', fontSize)
        localStorage.setItem('defaultLanguage', defaultLanguage)
        alert('Settings have been saved')
    }

    return (
        <div className="p-8 bg-background text-foreground min-h-screen overflow-y-auto">
            <p className="font-mono text-sm text-text-muted mb-8">
                // <span className="text-green-400">settings</span>
            </p>

            {/* Appearance */}
            <div className="border border-border rounded-xl mb-3 overflow-hidden bg-card">
                <div className="px-5 py-4 border-b border-border">
                    <p className="text-sm font-medium text-muted">Appearance</p>
                    <p className="text-xs font-mono text-text-muted mt-0.5">Customize how StackMind looks</p>
                </div>

                {/* Theme */}
                <div className="flex justify-between items-center px-5 py-4 border-b border-border">
                    <div>
                        <p className="text-sm text-muted">Theme</p>
                        <p className="text-xs font-mono text-text-muted mt-0.5">Choose your preferred color theme</p>
                    </div>
                    <div className="flex gap-1.5">
                        {(['dark', 'light', 'system'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setTheme(t)}
                                className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors ${theme === t
                                    ? 'bg-button text-button-text border-border'
                                    : 'text-muted border-border hover:text-zinc-400'
                                    }`}
                            >
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Font size */}
                <div className="flex justify-between items-center px-5 py-4 border-b border-border">
                    <div>
                        <p className="text-sm text-muted">Font size</p>
                        <p className="text-xs font-mono text-text-muted mt-0.5">Applies to notes and snippets editor</p>
                    </div>
                    <select
                        value={fontSize}
                        onChange={e => setFontSize(e.target.value)}
                        className="bg-button border border-border text-button-text text-xs font-mono px-3 py-1.5 rounded-lg outline-none focus:border-green-400/30"
                    >
                        <option value="small">Small (13px)</option>
                        <option value="medium">Medium (15px)</option>
                        <option value="large">Large (17px)</option>
                    </select>
                </div>


            </div>

            {/* Preferences */}
            <div className="bg-card border border-border rounded-xl mb-6 overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                    <p className="text-sm font-medium text-muted">Preferences</p>
                    <p className="text-xs font-mono text-text-muted mt-0.5">Customize your workspace behavior</p>
                </div>

                {/* Default language */}
                <div className="flex justify-between items-center px-5 py-4 border-b border-border">
                    <div>
                        <p className="text-sm text-muted">Default snippet language</p>
                        <p className="text-xs font-mono text-zinc-600 mt-0.5">Pre-select language when creating snippets</p>
                    </div>
                    <select
                        value={defaultLanguage}
                        onChange={e => setDefaultLanguage(e.target.value)}
                        className="bg-button border border-border text-button-text text-xs font-mono px-3 py-1.5 rounded-lg outline-none focus:border-green-400/30"
                    >
                        {['TypeScript', 'JavaScript', 'Python', 'Bash', 'SQL'].map(lang => (
                            <option key={lang}>{lang}</option>
                        ))}
                    </select>
                </div>

                {/* Auto save */}
                <div className="flex justify-between items-center px-5 py-4 border-b border-border">
                    <div>
                        <p className="text-sm text-muted">Auto-save Snippets</p>
                        <p className="text-xs font-mono text-zinc-600 mt-0.5">Save snippets automatically while typing</p>
                    </div>
                    <Toggle value={autoSave} onChange={() => setAutoSave(!autoSave)} />
                </div>

                <div className="flex justify-between items-center px-5 py-4 border-b border-border">
                    <div>
                        <p className="text-sm text-muted">Show Tags</p>
                        <p className="text-xs font-mono text-zinc-600 mt-0.5">Show Tags on notes</p>
                    </div>
                    <Toggle value={showTags} onChange={() => setShowTags(!showTags)} />
                </div>

                {/* Auto tagging */}
                {/* <div className="flex justify-between items-center px-5 py-4 border-b border-border">
                    <div>
                        <p className="text-sm text-muted">AI auto-tagging</p>
                        <p className="text-xs font-mono text-zinc-600 mt-0.5">Automatically generate tags when saving notes</p>
                    </div>
                    <Toggle value={autoTagging} onChange={() => setAutoTagging(!autoTagging)} />
                </div> */}

                {/* Confirm delete */}
                <div className="flex justify-between items-center px-5 py-4">
                    <div>
                        <p className="text-sm text-muted">Confirm before delete</p>
                        <p className="text-xs font-mono text-zinc-600 mt-0.5">Show confirmation dialog before deleting</p>
                    </div>
                    <Toggle value={confirmDelete} onChange={() => setConfirmDelete(!confirmDelete)} />
                </div>
            </div>

            {/* VS Code Integration */}
            <div className="bg-card border border-border rounded-xl mb-3 overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                    <p className="text-sm font-medium dark:text-zinc-200">VS Code Integration</p>
                    <p className="text-xs font-mono text-zinc-600 mt-0.5">
                        Connect your VS Code to save snippets and ask AI without leaving your editor
                    </p>
                </div>
                <div className="p-5">
                    <p className="text-xs font-mono text-black dark:text-zinc-600 mb-4 leading-relaxed">
                        1. Copy your API token below<br />
                        2. Open VS Code → <span className="text-blue-500 dark:text-green-400">Ctrl+Shift+P</span><br />
                        3. Type <span className="text-blue-500 dark:text-green-400">StackMind: Connect Account</span><br />
                        4. Paste your token
                    </p>
                    <CopyTokenButton/>
                </div>
            </div>

            {/* Save */}
            <div className="flex justify-end">
                <button className="text-sm font-mono font-medium bg-green-400 text-black px-5 py-2 rounded-lg hover:bg-green-300 transition-colors" onClick={saveSettings}>
                    Save settings
                </button>
            </div>
        </div>
    )
}