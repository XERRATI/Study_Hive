# 🛠️ Study Hive — Development Guide

How to **find**, **fix**, **refine**, and **add** things now that the app is split into
small files. Written so you can do this even if you're not a pro developer.

---

## 1. The mental model (read this once)

Study Hive is a single web page (`index.html`) that boots a chain of JavaScript files:

```
01 … 51 run in order, top to bottom.
```

- **`01-idle-scheduler.js`** runs *first* and must stay first — it wraps `setInterval` so
  the app doesn't drain battery when the tab is hidden.
- **`03 … 14` (`core-*`)** are the **main app** (countdown, clock, focus, XP, sergeant,
  queen, garden, etc.), split into ordered chunks at `<script>` boundaries.
- **`15 … 51`** are **"patch layers."** Each one is a self-contained feature or bug-fix
  that the original author stacked on top over time. That's why you'll see small files that
  each define their own tiny helpers — that's intentional, not a mistake.
- **`css/app.css`** holds *all* the styles, in original order. Section comments mark where
  each block came from.
- **Data** is stored in the browser's `localStorage` (no server). The countdown target is
  the key `goal-target-date-v1` (set during the Welcome screen).

**Golden rule: load order matters.** Later files often *wrap* functions defined earlier
(e.g. `js/42` replaces `showSergeantNag`). Never renumber the `NN-` prefixes.

---

## 2. Find the file for a feature

1. Open **`FILE-GUIDE.md`** — it lists every `js/` file with a one-line description.
2. For anything visual (colors, layout, a button's look), it's in **`css/app.css`**.
   Search the file for the class name you see in the page.
3. Use search across the whole project:

```bash
# "where is the Pomodoro timer handled?"
grep -rni "pomodoro" js/ css/

# "what localStorage key stores the streak?"
grep -rni "streak" js/
```

Tip: right-click the thing on the page → **Inspect** to get its `id` or class, then `grep`
for that.

---

## 3. ✅ Fix a bug

1. **Reproduce it** locally: `python3 -m http.server 8000` → open `http://localhost:8000`.
2. Press **F12 → Console**. Red text points at the broken file/line.
3. Find the file (see §2) and fix it.
4. **Refresh and confirm** the bug is gone.
5. Commit + push (see README §“Updating the live site”). If the fix doesn't show online,
   bump `CACHE_VERSION` in `sw.js`.

> The app has a built-in self-check too: **Settings → Run 20/10 Doctor** lists missing pieces
> and recent caught errors. Handy when something feels "off".

---

## 4. ♻️ Refine an existing feature

Same flow as fixing a bug — find the file, tweak values/wording/timing, test, push.
Common refinement targets:

| Want to change… | Look in… |
|---|---|
| Colors / theme palette | `css/app.css` → the `:root { --honey1 … }` variables |
| Bee animation speed | `css/app.css` (`@keyframes roam-bee-*`) and `js/46-bee-behaviour-final…` |
| How often the Sergeant nags | `js/42-final-queen-sergeant-music-balance-patch.js` (`minGap`) |
| Default music volume | `js/42-…` (`applyCalmDefaultOnce`) |
| Motivation / coach quotes | `js/15-admin-mode-massive-sergeant-context-bank.js` |
| Countdown target date | set in-app on the Welcome screen, or key `goal-target-date-v1` |

---

## 5. ➕ Add a brand-new feature (the safe way)

The cleanest pattern matches how every existing patch layer is built: **one new self-
contained file + one `<script>` line**. It loads last, so every app helper already exists.

### Step A — Create the file
Make `js/52-my-feature.js` (use the **next free number**; here 52). Start from this template:

```js
/* Study Hive  -  file 52: my-feature
   Loads after all existing scripts, so all app globals already exist.
   Add the matching <script> tag in index.html just before </body>.
*/
(function () {
  'use strict';

  // tiny local helpers (same pattern every patch layer uses)
  function $(id) { return document.getElementById(id); }
  function get(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function getJSON(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function setJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  // reuse a global the app already provides:
  // showMilestoneToast(message, milliseconds)  -> shows a little toast
  // recordStudyCompleted(subject, minutes)     -> logs a study session

  // --- your feature code here ---
  function sayHi() {
    if (typeof showMilestoneToast === 'function') showMilestoneToast('🐝 My feature is running!', 3000);
  }

  // run once the page is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sayHi);
  } else {
    sayHi();
  }
})();
```

### Step B — Wire it into the page
Open `index.html` and add one line **just before `</body>`** (after the `js/51` line):

```html
<script src="js/52-my-feature.js"></script>
</body>
```

### Step C — (If your feature has styles) add CSS
Append a block to the bottom of `css/app.css`, e.g.:
```css
/* ===== my feature ===== */
.my-feature-box { background: var(--cream); border-radius: 12px; padding: 10px; }
```

### Step D — Test, then push
Refresh locally, confirm it works, then commit & push. Bump `sw.js` `CACHE_VERSION` if needed.

### Numbering rule for new files
- New features/fixes always get the **next number after the current highest** (so they load
  last and can safely use everything before them).
- If a fix *must* run before something specific, only then pick a lower number — but that's
  rare and you should understand why order matters first.

---

## 6. Global helpers you can reuse

These already exist by the time your new file runs (so you don't need to redefine them,
though redefining tiny ones like `$` is harmless and common):

| Helper | What it does |
|---|---|
| `showMilestoneToast(msg, ms)` | shows a small toast message |
| `recordStudyCompleted(subject, minutes)` | logs a focus/study session (gives XP, etc.) |
| `showSergeantNag(text, angry)` | makes the Sergeant bee say something |
| `nextQuote()` | rotates the daily quote |
| `updateClock()` | refreshes the countdown |
| `$`, `getJSON`, `setJSON` | small DOM/storage helpers (most patch layers define their own copies) |

---

## 7. Where the user's data lives

Everything is in `localStorage`. A few important keys:

| Key | Holds |
|---|---|
| `goal-target-date-v1` | the date the countdown counts down **to** |
| `goal-title-v1` | the goal title shown big on the card |
| `study-data-v2` | subjects + minutes logged |
| `hive-xp-v1` / `study-hive-xp-v1` | XP / level |
| `hive-todos-v1` | task list |
| `hive-notes-v1` | quick notes |
| `hive-exams-v1` | exam countdowns |
| `secrets-found-v1` | unlocked easter eggs |

Use the in-app **Backup Center** (Settings) to export/import all of it. When debugging a
single user's data, `console.log(localStorage)` in F12 shows everything.

---

## 8. Testing checklist before you push

- [ ] Page loads with **no red errors** in the Console (F12).
- [ ] Countdown clock shows real numbers (not `NaN:NaN`).
- [ ] Open it on a **phone-width** window — panels should be usable, not cut off.
- [ ] Toggle **Night mode** and **Sleep mode** — nothing disappears/breaks.
- [ ] The feature you added/changed works, and you didn't break an existing one.
- [ ] If you changed visuals, check both light and night themes.

---

## 9. Common pitfalls

- **“I edited a file and now it's totally broken.”** Check the Console — almost always a
  missing `;`, `)`, or `}`. JavaScript runs top-to-bottom; one syntax error can stop later
  files.
- **Don't put `filter`/`transform` animations on `<body>`.** The app's fixed UI (bees,
  buttons, hive) relies on `<body>` *not* being a containing block — existing code has
  comments warning about exactly this. Use a sibling overlay `<div>` instead.
- **Order matters.** If you wrap a function (e.g. to change how the Sergeant talks), your
  file must load *after* the file that first defines that function — i.e. a higher number.
- **One panel open at a time.** `js/37-launch-stabilization…` closes other panels when you
  open one. If your feature opens a panel, give it the `.show` class and the `.misc-panel`
  pattern so it joins this system.

Happy building! 🐝
