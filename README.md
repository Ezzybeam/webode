# Webode

Mod loader for the browser version of Geometry Dash at geometrydash.com.

**[ezzybeam.github.io/webode](https://ezzybeam.github.io/webode/)**

**Included mods**
- **No Clip** — pass through everything (Z)
- **Show Hitboxes** — draw collision boxes (H)
- **Speedhack** — change game speed 0.1x–10x ([ / ]), optional music sync (M)
- **Reset** — restart the level

---

## Install

### Option 1 — Tampermonkey (easiest, no dev mode needed)

1. Install [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) from the Chrome Web Store
2. Click **[Install script](https://raw.githubusercontent.com/ezzybeam/webode/main/webode.user.js)**
3. Confirm install in Tampermonkey
4. Open geometrydash.com/game — mods are ready

---

### Option 2 — Chrome Extension (requires Developer Mode)

1. [Download the repo](https://github.com/ezzybeam/webode/archive/refs/heads/main.zip) and unzip it
2. Go to `chrome://extensions`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select the `extension` folder

---

### Option 3 — DevTools Overrides (manual)

1. Open geometrydash.com/game in Chrome
2. Open DevTools → Sources → Overrides → Enable Local Overrides
3. Right-click each file below and **Save for override**, then replace its content with the files from this repo:
   - `game/index.html`
   - `game/webode.js`
   - `game/mods/noclip.js`
   - `game/mods/reset.js`
   - `game/mods/hitboxes.js`
   - `game/mods/speedhack.js`
   - `game/assets/index-game.js`
4. Reload the page

---

## Repo structure

```
webode.user.js      tampermonkey install script
extension/          chrome extension (load unpacked)
webode.js           mod loader core
mods/               individual mods
  noclip.js
  reset.js
  hitboxes.js
  speedhack.js
```
