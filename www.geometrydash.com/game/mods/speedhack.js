// Intercept Web Audio source nodes BEFORE the game loads them
// so we can control music playback rate later.
(function () {
  const _orig = AudioBufferSourceNode.prototype.start;
  const _sources = [];
  window._speedhackSources = _sources;

  AudioBufferSourceNode.prototype.start = function (...args) {
    _sources.push(this);
    this.addEventListener('ended', () => {
      const i = _sources.indexOf(this);
      if (i !== -1) _sources.splice(i, 1);
    });
    return _orig.apply(this, args);
  };
})();

Webode.registerMod({
  id: 'speedhack',
  name: 'Speedhack',
  version: '1.0.0',
  author: 'ezzybeam',
  description: '[ ] adjust speed  •  M toggle music sync',

  _speed: 1.0,
  _musicSync: false,
  _hud: null,

  onLoad(api) {
    try {
      const s = JSON.parse(localStorage.getItem('webode:speedhack') || '{}');
      if (s.speed != null) this._speed = Math.max(0.1, Math.min(10.0, s.speed));
      if (s.musicSync != null) this._musicSync = !!s.musicSync;
    } catch (_) {}

    api.addKeybind('[', () => { if (api.enabled) this._changeSpeed(-0.1); });
    api.addKeybind(']', () => { if (api.enabled) this._changeSpeed(+0.1); });
    api.addKeybind('m', () => { if (api.enabled) this._toggleMusic(); });
  },

  // Called by Webode when the Phaser scene becomes ready.
  // Needed because onEnable() runs at page-load (before the scene exists)
  // when the mod state is restored from localStorage.
  _sceneReady() {
    if (this.enabled) this._patchUpdate();
  },

  onEnable() {
    this._patchUpdate();
    this._apply();
    this._showHud();
  },

  onDisable() {
    this._unpatchUpdate();
    this._setMusicRate(1.0);
    window._gdTimeScale = 1;
    this._hideHud();
  },

  // ── Speed ─────────────────────────────────────
  _changeSpeed(delta) {
    this._speed = Math.round(Math.max(0.1, Math.min(10.0, this._speed + delta)) * 10) / 10;
    this._apply();
    this._save();
    this._updateHud();
  },

  _toggleMusic() {
    this._musicSync = !this._musicSync;
    this._apply();
    this._save();
    this._updateHud();
    Webode.ui.toast('Music sync ' + (this._musicSync ? 'ON' : 'OFF'),
      this._musicSync ? '#0c8' : '#c44');
  },

  _apply() {
    // scene.update patch reads this._speed directly — no extra call needed
    // Also set window._gdTimeScale for the index-game.js physics hook (belt+suspenders)
    window._gdTimeScale = this._speed;
    this._setMusicRate(this._musicSync ? this._speed : 1.0);
  },

  // Patch scene.update so every delta is multiplied by our speed.
  // Deleting the instance property later restores the prototype method cleanly.
  _patchUpdate() {
    const scene = Webode.scene;
    if (!scene || scene._speedhackPatched) return;

    const mod = this;
    const origUpdate = scene.update.bind(scene);
    scene.update = function (time, delta) {
      origUpdate(time, delta * mod._speed);
    };
    scene._speedhackPatched = true;
  },

  _unpatchUpdate() {
    const scene = Webode.scene;
    if (!scene || !scene._speedhackPatched) return;
    delete scene.update;          // removes instance override → prototype restored
    delete scene._speedhackPatched;
  },

  _setMusicRate(rate) {
    // Only long-duration buffers are music (not short SFX)
    for (const src of window._speedhackSources || []) {
      try {
        if (src.buffer && src.buffer.duration > 5) {
          src.playbackRate.value = rate;
        }
      } catch (_) {}
    }
  },

  // ── Persistence ───────────────────────────────
  _save() {
    localStorage.setItem('webode:speedhack',
      JSON.stringify({ speed: this._speed, musicSync: this._musicSync }));
  },

  // ── HUD ───────────────────────────────────────
  _showHud() {
    if (this._hud) return;
    const el = document.createElement('div');
    el.id = 'speedhack-hud';
    el.style.cssText = [
      'position:fixed', 'bottom:16px', 'left:50%', 'transform:translateX(-50%)',
      'background:rgba(0,0,0,0.72)',
      'border:1px solid #333',
      'border-radius:4px', 'padding:4px 12px',
      'z-index:99990', 'color:#bbb',
      'font:12px Arial',
      'user-select:none', 'pointer-events:none'
    ].join(';');
    this._hud = el;
    document.body.appendChild(el);
    this._updateHud();
  },

  _hideHud() {
    if (this._hud) { this._hud.remove(); this._hud = null; }
  },

  _updateHud() {
    if (!this._hud) return;
    const s = this._speed;
    const music = this._musicSync ? ' | music on' : '';
    this._hud.textContent = `speed: ${s.toFixed(1)}x${music}`;
  },
});
