import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    console.log('StackMind extension is now active!');

    // ─── Command 1 — Save as Snippet ───────────────────────────
    const saveSnippet = vscode.commands.registerCommand('stackmind.saveSnippet', async () => {

        // Step 1 — Check token first
        const token = await context.secrets.get('stackmind-token')
        if (!token) {
            vscode.window.showErrorMessage('Please connect your StackMind account first. Run "StackMind: Connect Account"')
            return
        }

        // Step 2 — Get the active editor
        const editor = vscode.window.activeTextEditor
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found')
            return
        }

        // Step 3 — Get selected text
        const selectedText = editor.document.getText(editor.selection)
        if (!selectedText) {
            vscode.window.showErrorMessage('Please select some code first')
            return
        }

        // Step 4 — Ask for snippet title
        const title = await vscode.window.showInputBox({
            prompt: 'Enter a title for this snippet',
            placeHolder: 'e.g. useDebounce hook'
        })

        if (!title) return  // user pressed Escape

        // Step 5 — Detect language automatically
        const language = editor.document.languageId  // e.g. 'typescript', 'python'

        // Step 6 — Call StackMind API (we'll add auth next)
        try {
            vscode.window.showInformationMessage(`Saving "${title}" to StackMind...`)

            const res = await fetch('https://stack-mind-ten.vercel.app/api/snippets/vscode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, code: selectedText, language })
            })
        } catch (error) {

        }




    })

    // ─── Command 2 — Ask AI ────────────────────────────────────
    const askAI = vscode.commands.registerCommand('stackmind.askAI', async () => {

        // Step 1 — Get selected text
        const editor = vscode.window.activeTextEditor
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found')
            return
        }

        const selectedText = editor.document.getText(editor.selection)
        if (!selectedText) {
            vscode.window.showErrorMessage('Please select some code first')
            return
        }

        // Step 2 — Ask what they want to know
        const question = await vscode.window.showInputBox({
            prompt: 'What do you want to know about this code?',
            placeHolder: 'e.g. Why is this causing a memory leak?'
        })

        if (!question) return

        // Step 3 — Call StackMind AI (we'll add this next)
        vscode.window.showInformationMessage(`Asking StackMind AI...`)

        console.log({ selectedText, question })

    })

    // ─── Command 3 — Authenticate User ────────────────────────────────────

    const connect = vscode.commands.registerCommand('stackmind.connect', async () => {
        const token = await vscode.window.showInputBox({
            prompt: 'Paste your StackMind API token',
            placeHolder: 'Get it from StackMind → Settings → VS Code Integration',
            password: true  // ← hides the token as user types
        })

        if (!token) return

        // Store securely in VS Code secret storage
        await context.secrets.store('stackmind-token', token)
        vscode.window.showInformationMessage('StackMind connected successfully! ✅')
    })

    // Register commands
    context.subscriptions.push(saveSnippet)
    context.subscriptions.push(askAI)
    context.subscriptions.push(connect)
}

export function deactivate() { }