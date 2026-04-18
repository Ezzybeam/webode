Webode.registerMod({
  id: 'levels',
  name: 'Level Loader',
  version: '1.0.0',
  author: 'Webode',
  description: 'Load any GD level by ID',

  _el: null,

  onLoad(api) {
    api.addKeybind('l', () => this._toggleUI());
  },

  // Patch cache.text.get so we can swap in custom level data before the game reads it
  _sceneReady(scene) {
    const origGet = scene.cache.text.get.bind(scene.cache.text);
    scene.cache.text.get = function(key) {
      if (key === 'level_1' && window._gdCustomLevel) return window._gdCustomLevel;
      return origGet(key);
    };
  },

  onEnable() {},
  onDisable() { this._hideUI(); },

  _toggleUI() {
    if (this._el) { this._hideUI(); return; }
    this._showUI();
  },

  _showUI() {
    const el = document.createElement('div');
    el.id = 'levels-ui';
    el.style.cssText = [
      'position:fixed', 'top:50%', 'left:50%',
      'transform:translate(-50%,-50%)',
      'background:#111118', 'border:1px solid #2e2e3e',
      'border-radius:6px', 'padding:18px 20px',
      'z-index:99999', 'color:#bbb',
      'font:13px Arial', 'box-shadow:0 8px 32px rgba(0,0,0,0.8)',
      'min-width:260px'
    ].join(';');

    const title = document.createElement('div');
    title.textContent = 'Load Level';
    title.style.cssText = 'font:bold 14px Arial;color:#ddd;margin-bottom:12px';

    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:8px';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Level ID (e.g. 128)';
    input.style.cssText = [
      'flex:1', 'background:#1a1a26', 'border:1px solid #2e2e3e',
      'border-radius:4px', 'padding:6px 10px',
      'color:#ccc', 'font:13px Arial', 'outline:none'
    ].join(';');

    const btn = document.createElement('button');
    btn.textContent = 'Load';
    btn.style.cssText = [
      'background:#1a1a26', 'border:1px solid #2e2e3e',
      'border-radius:4px', 'padding:6px 12px',
      'color:#aaa', 'font:13px Arial', 'cursor:pointer'
    ].join(';');

    const status = document.createElement('div');
    status.style.cssText = 'margin-top:8px;font:11px Arial;color:#555;min-height:16px';

    const load = async () => {
      const id = input.value.trim();
      if (!id) return;
      status.textContent = 'fetching...';
      btn.disabled = true;
      try {
        const data = await this._fetchLevel(id);
        window._gdCustomLevel = data;
        status.textContent = 'loaded — restarting...';
        setTimeout(() => {
          this._hideUI();
          const scene = Webode.scene;
          if (scene && scene['_restartLevel']) scene['_restartLevel']();
        }, 600);
      } catch (e) {
        status.textContent = 'error: ' + e.message;
        btn.disabled = false;
      }
    };

    btn.onclick = load;
    input.onkeydown = e => { if (e.key === 'Enter') load(); if (e.key === 'Escape') this._hideUI(); };

    row.appendChild(input);
    row.appendChild(btn);
    el.appendChild(title);
    el.appendChild(row);
    el.appendChild(status);
    document.body.appendChild(el);
    this._el = el;
    setTimeout(() => input.focus(), 0);
  },

  _hideUI() {
    if (this._el) { this._el.remove(); this._el = null; }
  },

  async _fetchLevel(id) {
    // GDBrowser has CORS enabled and returns raw level data
    const res = await fetch('https://gdbrowser.com/api/level/' + encodeURIComponent(id));
    if (!res.ok) throw new Error('level not found');
    const json = await res.json();
    if (!json.data) throw new Error('no level data in response');
    return json.data;
  }
});
