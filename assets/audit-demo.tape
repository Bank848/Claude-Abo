# Records assets/audit-demo.gif on a synthetic config (assets/demo/make-demo-home.mjs). Not the author's setup.
# Run from the repo root with vhs and ttyd on PATH and $env:REPO set to the repo root:  vhs assets/audit-demo.tape
# A hidden `npx` function runs the local checkout, so the GIF shows the real command without a network fetch.
Output assets/audit-demo.gif
Set Shell "powershell"
Set FontSize 14
Set Width 1100
Set Height 780
Set Padding 16
Set Theme "Dracula"
Set TypingSpeed 35ms

Hide
Sleep 2s
Type `function prompt { '$ ' }; function npx { node "$env:REPO/bin/claude-abo.mjs" $args[1..($args.Length-1)] --home D:/abo-demo --cwd D:/abo-demo/project }; cd D:/abo-demo; Clear-Host` Enter
Sleep 1500ms
Show

Type "npx github:Bank848/Claude-Abo audit --probe-hooks" Sleep 400ms Enter
Sleep 9s
