# 🐝 Study Hive

A honey-themed study **countdown**, **focus timer**, **flashcards** and motivation app —
all in one. It runs entirely in the browser (no server, no login). Your progress is saved
on your own device.

This repository is the **split, maintainable version** of the app. The original was one
giant ~900 KB `study-hive-smoother (18).html` file. It has been split into a clean
project so you can find things, fix bugs, and add features without scrolling through
thousands of lines.

> ✅ The split is **lossless** — every script and every style was extracted in the exact
> same order as the original, so the app behaves identically.

---

## 📁 What's inside

```
study-hive/
├── index.html              ← the page. open THIS in a browser
├── css/
│   └── app.css             ← ALL styles, merged in original order
├── js/
│   ├── 01-idle-scheduler.js   ← loads FIRST (must run before the others)
│   ├── 02-startup-animation.js
│   ├── 03 … 14  core-app.js   ← the main app, split into ordered chunks
│   ├── 15 … 51  feature & fix “patch layers”
│   └── (add 52, 53, … for your own features — see DEVELOPMENT.md)
├── icons/icon-512.png      ← app icon (install-to-home-screen)
├── manifest.webmanifest    ← lets phones “install” the app
├── sw.js                   ← offline service worker (network-first)
├── study-hive-privacy-policy.html
├── study-hive-terms-of-service.html
├── FILE-GUIDE.md           ← what every js/ file does (quick map)
├── DEVELOPMENT.md          ← how to add features & fix bugs
└── .nojekyll / .gitignore
```

The two numbers in each `js/` filename are its **load order** — `01` runs first, `51` runs
last. This order matters (later files build on / wrap earlier ones), so **never rename the
`NN-` prefix**.

---

## ▶️ Run it on your own computer first (recommended)

Always test locally before putting changes online.

**Easy way** — just double-click `index.html`. It opens in your browser. Done.

**Better way** (closer to how it runs online) — use a tiny local server:

```bash
# inside the study-hive folder:
python3 -m http.server 8000
```
Then visit <http://localhost:8000> in your browser. Press `Ctrl+C` to stop.

> The first time it loads you'll get a short **Welcome / setup** screen. That's where you
> set your study goal title and target date — the countdown counts down to that date.

---

## 🚀 Put it on GitHub Pages (free, public website)

This is the main goal: a live URL like
`https://YOUR-USERNAME.github.io/study-hive/` that anyone can open.

### Step 1 — Make a GitHub account (if you don't have one)
Go to <https://github.com> and sign up. It's free.

### Step 2 — Create a new, empty repository
1. Click the **+** (top-right) → **New repository**.
2. **Repository name:** `study-hive` (keep it short, no spaces).
3. Set it **Public** (Pages needs public for free accounts).
4. **Don't** add a README or .gitignore here (we already have files).
5. Click **Create repository**.

### Step 3 — Upload the files

#### Option A — Drag & drop in the browser (no software needed)
1. In your new repo, click **Add file → Upload files**.
2. **Important:** GitHub's web uploader does not upload *folders* directly. Do this:
   - First upload every **loose file** at the root: drag in `index.html`,
     `manifest.webmanifest`, `sw.js`, `study-hive-privacy-policy.html`,
     `study-hive-terms-of-service.html`, `.nojekyll`, `.gitignore`.
   - Commit.
   - Then click **Add file → Create new file**, type `css/app.css` (the `/` makes the
     `css` folder), delete the auto-text, and instead click **Upload files** again —
     GitHub now shows the folder. Repeat to create `js/` and `icons/` the same way, then
     upload the contents of each folder.
3. Commit with a message like `first upload`.

   > Easier alternative: install **GitHub Desktop** (<https://desktop.github.com>), clone
   > the repo, copy this whole folder into it, and click **Commit → Push**. It uploads
   > folders for you.

#### Option B — Use Git on the command line (fastest once set up)
```bash
# one-time setup on a new computer:
git config --global user.name  "Your Name"
git config --global user.email "you@example.com"

# inside the study-hive folder:
git init
git add .
git commit -m "first upload of Study Hive"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/study-hive.git
git push -u origin main
```
(Replace `YOUR-USERNAME` with your GitHub username.)

### Step 4 — Turn on GitHub Pages
1. In your repo, click **Settings** (top tab).
2. Left menu → **Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. **Branch:** select `main` and the `/(root)` folder → click **Save**.
5. Wait 1–2 minutes, then refresh that same Pages settings page.

### Step 5 — Open your live site 🎉
The green banner on the Pages settings page shows your URL:
```
https://YOUR-USERNAME.github.io/study-hive/
```
Open it on your phone too. In the browser menu choose **Add to Home Screen** to install it
like an app.

---

## 🔄 Updating the live site after you change something

If you used **Git / GitHub Desktop**: edit files, then `git add .` → `git commit -m "..."` →
`git push`. GitHub Pages auto-rebuilds in ~1 minute.

If you used the **web uploader**: just edit the file on GitHub (✏️ pencil icon) or re-upload
the changed file and commit.

> ⚠️ **“I changed it but the site looks the same!”** → Your browser or the service worker is
> showing a cached copy. Fix: open `sw.js`, bump `CACHE_VERSION` from `study-hive-v1` to
> `study-hive-v2`, commit, then do a hard refresh (`Ctrl/Cmd + Shift + R`).

---

## 🎵 Add your own background music

The app can play a custom track you provide:
1. Put a file named `background-music.mp3` in the project root (next to `index.html`).
2. Upload it to GitHub too (it's large — consider GitHub Desktop for big files).
3. Use the in-app **Hive Controls** menu to turn it on and set the volume.

The built-in **lofi** tones need no file — they're generated in the browser.

---

## 🧩 Add features / fix bugs / refine things

That's a whole guide on its own — see **[DEVELOPMENT.md](DEVELOPMENT.md)**. The short version:
open `FILE-GUIDE.md` to find which file a feature lives in, edit it, test locally, then push.
To add something brand-new, create a new `js/52-your-feature.js` file and add one
`<script>` line in `index.html` (full template inside DEVELOPMENT.md).

---

## ❓ Troubleshooting

| Problem | Fix |
|---|---|
| Blank page / nothing happens | Open the browser **Console** (F12) and look for red errors. Usually a typo in a file you edited. |
| Changes don't appear online | Bump `CACHE_VERSION` in `sw.js`, then hard-refresh. |
| 404 for music | `background-music.mp3` is missing — it's optional; lofi tones still work. |
| Panels look cut off on phone | That's the original app's layout; see `DEVELOPMENT.md` for the responsive files. |
| “This file was too big to upload” | Use GitHub Desktop instead of the web uploader. |

---

## 📄 Ownership & license

Study Hive © 2026 the Creator (`studyhive.co.za@gmail.com`). Proprietary source — not for
copying, cloning, rebranding, resale, redistribution, or derivative works without written
permission. See the header comment at the top of `index.html`.
