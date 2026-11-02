export const installSteps = [
  {
    title: "Download the app",
    body: "Tap Download Seller App below. If your phone asks to keep the file, tap Download or Keep. The file is called agrivive-seller.apk.",
  },
  {
    title: "Open the file",
    body: "Open your notifications or the Downloads folder and tap agrivive-seller.apk.",
  },
  {
    title: "Allow the install",
    body: "If your phone says it is blocked, tap Settings, then turn on Allow from this source. Go back and tap the file again.",
  },
  {
    title: "Tap Install",
    body: "If Play Protect shows a warning, tap More details, then Install anyway. The app comes straight from Agrivive.",
  },
  {
    title: "Open Agrivive",
    body: "Tap Open, then sign in or create a seller account.",
  },
] as const;

export const helpItems = [
  {
    problem: "It says App not installed",
    fix: "Delete any older Agrivive app on your phone, then try again. Make sure your phone has at least 200 MB of free space.",
  },
  {
    problem: "Play Protect blocked it",
    fix: "Tap More details, then Install anyway. You can also turn off Scan apps with Play Protect for a short time.",
  },
  {
    problem: "The file will not open",
    fix: "Download it again with a steady connection. A file that stopped halfway cannot be installed.",
  },
] as const;
