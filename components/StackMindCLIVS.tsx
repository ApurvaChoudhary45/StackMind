import React from 'react'

const StackMindCLIVS = () => {
  return (
    <>
    <div className="rounded-xl border border-border bg-card p-5 mt-5">

  <div className="flex items-center gap-2 mb-2">
    <i className="ti ti-terminal-2 text-green-400 text-xl" />
    <h3 className="font-semibold">
      StackMind CLI
    </h3>
  </div>

  <p className="text-sm text-muted-foreground mb-4">
    Save snippets, review code and use AI directly from your terminal.
  </p>

  <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">

    <code className="text-sm">
      npm install -g stackmind-cli
    </code>

    <button
      onClick={() =>
        navigator.clipboard.writeText(
          "npm install -g stackmind-cli"
        )
      }
      className="text-green-400"
    >
      <i className="ti ti-copy" />
    </button>

  </div>

  <div className="mt-4 rounded-lg bg-background p-3 text-sm font-mono">

    stackmind login

  </div>

</div>
<div className="rounded-xl border border-border bg-card p-5 mt-5">

  <div className="flex items-center gap-2 mb-2">
    <i className="ti ti-brand-visual-studio text-blue-400 text-xl" />
    <h3 className="font-semibold">
      VS Code Extension
    </h3>
  </div>

  <p className="text-sm text-muted-foreground mb-5">
    Install StackMind directly inside VS Code.
  </p>

  <a
    href="/downloads/stackmind-vscode-0.0.2.vsix"
    download
    className="inline-flex items-center gap-2 rounded-lg bg-green-400 px-4 py-2 text-black font-medium hover:bg-green-300"
  >
    <i className="ti ti-download" />
    Download Extension
  </a>

</div>

<div className="mt-5 rounded-lg border border-border bg-background p-4">

<p className="font-medium mb-3">
Installation
</p>

<ol className="space-y-2 text-sm text-muted-foreground list-decimal pl-5">

<li>Download the .vsix file.</li>

<li>Open VS Code.</li>

<li>Open Extensions (Ctrl + Shift + X).</li>

<li>Click the ••• menu.</li>

<li>Select <b>Install from VSIX...</b></li>

<li>Select the downloaded file.</li>

<li>Reload VS Code.</li>

<li>Run <b>StackMind: Login</b>.</li>

</ol>

</div>

<div className="flex items-center justify-between rounded-lg bg-background p-3 mt-4">

<code>stackmind login</code>

<button
onClick={() =>
navigator.clipboard.writeText("stackmind login")
}
>
<i className="ti ti-copy"/>
</button>

</div>
</>


  )
}

export default StackMindCLIVS
