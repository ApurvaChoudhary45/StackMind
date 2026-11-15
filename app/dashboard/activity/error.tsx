'use client'
export default function ActivityError({ reset }: { reset: () => void }) {
    return <div className="p-8"><p role="alert">Could not load activity history.</p><button onClick={reset} className="mt-4 rounded-lg bg-green-400 px-4 py-2 text-black">Try again</button></div>
}
