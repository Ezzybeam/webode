# Webode — Design Spec
**Date:** 2026-04-16  
**Project:** Geometry Dash Browser Mod Loader  
**Target:** www.geometrydash.com (Chrome Overrides)

---

## Overview

Webode is a Geode-style mod loader for the browser version of Geometry Dash. Mods are JavaScript files that register themselves with the Webode API. A GD-styled button in the main menu opens a mod panel where players can see and toggle installed mods.

---

## Architecture

Three files, each with a single responsibility:

```
game/
├── index.html          — loads webode.js + mod scripts before the game module
├── webode.js           — Webode core (new Chrome Override)
└── assets/
    └── index-game.js   — game JS, two patches only:
                          1. killPlayer() checks window._gdNoClip
                          2. scene create() calls Webode._onSceneReady(this)
```

Mods are plain `<script>` tags added to `index.html`. Each calls `Webode.registerMod(...)`. No server, no package manager — just files Chrome can override.

---

## Webode Core (`webode.js`)

### Mod Registry

```js
Webode.registerMod({
  id: 'noclip',           // unique string
  name: 'No Clip',        // display name
  version: '1.0.0',
  author: 'ezzybeam',
  description: 'Pass through obstacles',
  onLoad(api) { ... },    // called immediately on register
  onEnable() { ... },     // called when player toggles mod ON
  onDisable() { ... }     // called when player toggles mod OFF
})
```

Each mod gets an `api` object in `onLoad` with helpers:
- `api.addKeybind(key, fn)` — register a key press handler
- `api.toggle()` — toggle this mod's enabled state
- `api.enabled` — current enabled state

### Event Hooks

```js
Webode.on('death', handler)     // player hits obstacle
Webode.on('restart', handler)   // level restarts
Webode.on('complete', handler)  // level finished
Webode.on('jump', handler)      // player jumps
Webode.on('land', handler)      // player lands on ground
```

Hooks fire from patches in `index-game.js`. Each event passes a context object with relevant game state.

### Scene Bridge

```js
Webode.scene    // the Phaser GameScene instance
Webode.player   // the player controller object
Webode.state    // the player state (p) object: { y, yVelocity, isDead, onGround, ... }
```

Set when `Webode._onSceneReady(scene)` is called by the game's `create()` method.

---

## UI

### Mods Button (Main Menu)

- Injected into the GD main menu via Phaser after `_onSceneReady`
- Uses the game's existing `GJ_WebSheet` texture atlas so it matches GD's visual style
- Positioned near the existing menu buttons
- Styled with Pusab font (already loaded by the game)

### Mods Panel

- Opens as a Phaser overlay (same layer system the game uses)
- Dark semi-transparent background matching GD's panel style
- Lists all registered mods, each row showing:
  - Mod name + version
  - Author
  - Short description
  - Toggle button (ON/OFF, GD-styled)
- Close button (X) in top-right corner
- Keyboard shortcut: `Escape` closes the panel

---

## Bundled Mods (v1)

Two mods ship by default, converted from the existing inline scripts:

| Mod | Keybind | What it does |
|-----|---------|-------------|
| No Clip | Z | Skip death — passes through obstacles |
| Quick Reset | R | Instantly restart the current level |

---

## Chrome Overrides Required

| File | Status |
|------|--------|
| `game/index.html` | Already overridden |
| `game/assets/index-game.js` | Already overridden |
| `game/webode.js` | New — add this override |

---

## What's Out of Scope (v1)

- Online mod repository / browsing
- Mod-to-mod dependencies
- Persistent mod settings (saved across sessions)
