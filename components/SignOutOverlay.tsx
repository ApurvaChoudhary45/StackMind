import React from 'react'

const SignOutOverlay = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md">
  <div className="flex flex-col items-center gap-5">
    <div className="relative h-16 w-16">
      <div className="absolute inset-0 animate-spin rounded-full border-4 border-zinc-700 border-t-green-400" />
    </div>

    <div className="space-y-1 text-center">
      <h3 className="font-semibold text-white">
        Signing you out...
      </h3>

      <p className="text-sm text-zinc-400">
        Saving your session securely.
      </p>
    </div>
  </div>
</div>
  )
}

export default SignOutOverlay
