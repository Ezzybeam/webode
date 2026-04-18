# Making Mods for Webode

**[ezzybeam.github.io/webode](https://ezzybeam.github.io/webode/)**

Mods are plain `.js` files that call `Webode.registerMod()`. No build tools, no imports.

---

## Minimal mod

```js
Webode.registerMod({
  id: 'my-mod',          // unique, no spaces
  name: 'My Mod',        // shown in the panel
  version: '1.0.0',
  author: 'yourname',
  description: 'Does a thing',

  onLoad(api) {
    api.addKeybind('t', () => api.toggle());
  },

  onEnable() {
    // mod turned on
  },

  onDisable() {
    // mod turned off — clean up everything you started
  }
});
```

---

## Lifecycle hooks

| Hook | When it runs |
|------|-------------|
| `onLoad(api)` | Once at page load — set up keybinds and read saved state here |
| `onEnable()` | Every time the user turns the mod on |
| `onDisable()` | Every time the user turns the mod off |
| `_sceneReady(scene)` | When the Phaser game scene finishes loading — use this if `onEnable` runs too early |

> **Why `_sceneReady`?** If the mod was on when the page last closed, `onEnable` runs during script load before the game scene exists. `_sceneReady` fires once the scene is ready, so it's the safe place to patch scene methods or start drawing.

```js
_sceneReady(scene) {
  if (!scene['someMethod']) return; // guard — not every scene has game methods
  if (this.enabled) this._startSomething();
},
```

---

## The `api` object

Passed to `onLoad`. Holds the mod's own controls.

```js
api.toggle()              // enable/disable the mod (saves state to localStorage)
api.enabled               // true if currently on
api.addKeybind(key, fn)   // register a key listener (see below)
```

---

## Keybinds

```js
onLoad(api) {
  api.addKeybind('z', () => api.toggle());    // single char
  api.addKeybind('[', () => doSomething());   // bracket keys work
  api.addKeybind('arrowup', () => {});        // use e.key.toLowerCase() values
}
```

Ctrl/Meta/Alt combos are ignored automatically.

---

## Toasts

```js
Webode.ui.toast('hello', '#0c8');   // green
Webode.ui.toast('oops',  '#c44');   // red
Webode.ui.toast('info');            // default dark
```

---

## Accessing the game

```js
Webode.scene    // Phaser scene object (null until _sceneReady fires)
Webode.player   // shorthand for scene['_player']
Webode.state    // shorthand for scene['_state'] — has .x, .y, .vel, etc.
```

The game's level data lives at `Webode.scene['_level']`. Its `objects` array has every collision object:

```js
const level = Webode.scene['_level'];
for (const obj of level['objects']) {
  // obj.x, obj.y    — world position (center)
  // obj.w, obj.h    — size
  // obj.rot         — rotation in degrees
  // obj.type        — 'solid', 'hazard', 'pad', 'ring', 'portal', etc.
}
```

Screen coordinates need a conversion because the game uses container scrolling, not a real Phaser camera:

```js
const camX = Webode.scene['_cameraX'] || 0;
const camY = Webode.scene['_cameraY'] || 0;
const H = 460; // game's internal height constant

const screenX = obj.x - camX;
const screenY = (H - obj.y) + camY;
```

---

## Persistence

Save anything to localStorage under a namespaced key:

```js
// Save
localStorage.setItem('webode:my-mod', JSON.stringify({ value: 42 }));

// Load (in onLoad)
try {
  const saved = JSON.parse(localStorage.getItem('webode:my-mod') || '{}');
  if (saved.value != null) this._value = saved.value;
} catch (_) {}
```

`api.toggle()` already saves the on/off state automatically — you only need this for extra settings like speed values.

---

## Drawing on screen

Use Phaser `Graphics` for overlays. Create in `onEnable`/`_sceneReady`, destroy in `onDisable`.

```js
onEnable() {
  const scene = Webode.scene;
  if (!scene) return;
  this._g = scene.add.graphics();
  this._g.setScrollFactor(0).setDepth(999); // fixed to screen, on top
  this._fn = () => this._draw();
  scene.events.on('postupdate', this._fn);  // redraws every frame
},

onDisable() {
  if (this._g) { this._g.destroy(); this._g = null; }
  if (this._fn && Webode.scene) {
    Webode.scene.events.off('postupdate', this._fn);
    this._fn = null;
  }
},

_draw() {
  const g = this._g;
  g.clear();
  g.fillStyle(0xff0000, 0.5);
  g.fillRect(10, 10, 50, 50);
}
```

---

## Adding your mod to the project

**1. Create your file** at `mods/my-mod.js`

**2. Add it to `webode.user.js`** (Tampermonkey):
```js
const files = [
  'webode.js',
  'mods/noclip.js',
  // ...
  'mods/my-mod.js',  // add here
];
```

**3. Add it to `webode-extension/inject.js`** (Chrome extension):
```js
const files = [
  'webode.js',
  'mods/noclip.js',
  // ...
  'mods/my-mod.js',  // add here
];
```

**4. For DevTools overrides**, also add a `<script>` tag to `www.geometrydash.com/game/index.html`:
```html
<script src="./mods/my-mod.js"></script>
```
And copy your file to `www.geometrydash.com/game/mods/my-mod.js`.

---

## Example: highlight the player in red

```js
Webode.registerMod({
  id: 'highlight',
  name: 'Player Highlight',
  version: '1.0.0',
  author: 'you',
  description: 'Draws a red circle on the player',

  onLoad(api) {
    api.addKeybind('p', () => api.toggle());
  },

  _sceneReady() {
    if (this.enabled) this._start();
  },

  onEnable() { this._start(); },
  onDisable() { this._stop(); },

  _start() {
    const scene = Webode.scene;
    if (!scene || this._g) return;
    this._g = scene.add.graphics();
    this._g.setScrollFactor(0).setDepth(999);
    this._fn = () => this._draw();
    scene.events.on('postupdate', this._fn);
  },

  _stop() {
    if (this._g) { this._g.destroy(); this._g = null; }
    if (this._fn && Webode.scene) {
      Webode.scene.events.off('postupdate', this._fn);
      this._fn = null;
    }
  },

  _draw() {
    const g = this._g;
    const scene = Webode.scene;
    const state = Webode.state;
    if (!g || !state) return;

    const camY = scene['_cameraY'] || 0;
    const H = 460;
    const px = scene.scale.width / 2 - 150;
    const py = (H - state['y']) + camY;

    g.clear();
    g.lineStyle(3, 0xff0000, 1);
    g.strokeCircle(px, py, 40);
  }
});
```
