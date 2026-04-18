// game/webode.js
(function () {
  'use strict';

  const WEBODE_LOGO = 'data:image/png;base64,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';

  const _handlers = {};
  const _keybinds = {};
  const _mods = [];
  let _scene = null;
  let _menuBtn = null;
  let _panelEl = null;
  let _panelEscHandler = null;
  let _panelOpen = false;

  const Webode = {
    version: '0.1.0',
    mods: _mods,

    // Called by index-game.js patch when scene create() runs
    _onSceneReady(scene) {
      _scene = scene;
      _loadLogoTexture(scene);
      _mods.forEach(m => m._sceneReady && m._sceneReady(scene));
    },

    // Mod registration
    registerMod(def) {
      const mod = Object.assign({ enabled: false }, def);
      const _key = 'webode:' + mod.id;
      const api = {
        get enabled() { return mod.enabled; },
        toggle() {
          mod.enabled = !mod.enabled;
          localStorage.setItem(_key, mod.enabled ? '1' : '');
          mod.enabled ? mod.onEnable && mod.onEnable() : mod.onDisable && mod.onDisable();
          Webode.ui.toast(mod.name + (mod.enabled ? ' ON' : ' OFF'), mod.enabled ? '#0c8' : '#c44');
          _refreshPanel();
        },
        addKeybind(key, fn) { Webode.addKeybind(key, fn); }
      };
      mod._api = api;
      _mods.push(mod);
      mod.onLoad && mod.onLoad(api);
      // Restore saved enabled state
      if (localStorage.getItem(_key) === '1') {
        mod.enabled = true;
        mod.onEnable && mod.onEnable();
      }
    },

    // Event system
    on(event, fn) {
      (_handlers[event] = _handlers[event] || []).push(fn);
    },
    emit(event, data) {
      (_handlers[event] || []).forEach(fn => { try { fn(data); } catch(e) { console.warn('[Webode]', e); } });
    },

    // Keybind system
    addKeybind(key, fn) {
      (_keybinds[key.toLowerCase()] = _keybinds[key.toLowerCase()] || []).push(fn);
    },

    // Scene bridge
    get scene() { return _scene; },
    get player() { return _scene && _scene['_player']; },
    get state() { return _scene && _scene['_state']; },

    // UI namespace (filled in Task 5)
    ui: {
      toast(msg, color) { _showToast(msg, color); },
      openPanel() { _openPanel(); },
      closePanel() { _closePanel(); }
    }
  };

  // Keybind listener
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const key = e.key.toLowerCase();
    (_keybinds[key] || []).forEach(fn => fn(e));
  });

  // Stubs — filled in later tasks
  function _loadLogoTexture(scene) {
    if (scene.textures.exists('webode-logo')) {
      _onLogoReady(scene);
      return;
    }
    scene.textures.once('addtexture-webode-logo', () => _onLogoReady(scene));
    scene.textures.addBase64('webode-logo', WEBODE_LOGO);
  }

  function _onLogoReady(scene) {
    _buildMenuButton(scene);
  }
  function _showToast(msg, color) {
    let el = document.getElementById('webode-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'webode-toast';
      el.style.cssText = [
        'position:fixed', 'top:12px', 'left:50%', 'transform:translateX(-50%)',
        'z-index:99999', 'padding:4px 12px', 'border-radius:4px',
        'font:bold 12px Arial', 'pointer-events:none',
        'transition:opacity .25s', 'opacity:0', 'white-space:nowrap'
      ].join(';');
      document.body.appendChild(el);
    }
    el.style.background = color || '#334';
    el.style.color = '#fff';
    el.style.border = '1px solid rgba(255,255,255,0.15)';
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.opacity = '0'; }, 1800);
  }
  function _openPanel() {
    if (_panelOpen || !document.body) return;
    _panelOpen = true;

    if (!document.getElementById('webode-styles')) {
      const s = document.createElement('style');
      s.id = 'webode-styles';
      s.textContent = `
        @keyframes _wIn { from{opacity:0} to{opacity:1} }
        #webode-panel { animation: _wIn .1s ease both; }
        .wCard:hover { background: #1e1e2a !important; }
        .wClose:hover { background: #3a1a1a !important; color: #f88 !important; }
      `;
      document.head.appendChild(s);
    }

    const panel = document.createElement('div');
    panel.id = 'webode-panel';
    panel.style.cssText = [
      'position:fixed', 'top:50%', 'left:50%',
      'transform:translate(-50%,-50%)',
      'width:280px',
      'background:#111118',
      'border:1px solid #2e2e3e',
      'border-radius:6px',
      'z-index:99999',
      'color:#ccc',
      'font-family:Arial,sans-serif',
      'box-shadow:0 8px 32px rgba(0,0,0,0.8)',
      'overflow:hidden'
    ].join(';');

    // ── Header ──
    const header = document.createElement('div');
    header.style.cssText = [
      'display:flex', 'align-items:center', 'gap:8px',
      'padding:10px 12px',
      'background:#16161f',
      'border-bottom:1px solid #2e2e3e'
    ].join(';');

    const logoImg = document.createElement('img');
    logoImg.src = WEBODE_LOGO;
    logoImg.style.cssText = 'width:24px;height:24px;flex-shrink:0;opacity:0.85';

    const titleWrap = document.createElement('div');
    titleWrap.style.cssText = 'flex:1;min-width:0';

    const titleEl = document.createElement('div');
    titleEl.textContent = 'Webode';
    titleEl.style.cssText = 'font:bold 14px Arial;color:#aaa';

    const subEl = document.createElement('div');
    subEl.textContent = 'mod loader v' + Webode.version;
    subEl.style.cssText = 'font:10px Arial;color:#555;margin-top:1px';

    titleWrap.appendChild(titleEl);
    titleWrap.appendChild(subEl);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'wClose';
    closeBtn.textContent = 'X';
    closeBtn.style.cssText = [
      'background:#1e1e2a', 'border:1px solid #333',
      'color:#666', 'font:bold 11px Arial', 'cursor:pointer',
      'width:22px', 'height:22px', 'border-radius:3px', 'line-height:22px',
      'text-align:center', 'flex-shrink:0', 'padding:0'
    ].join(';');
    closeBtn.onclick = () => _closePanel();

    header.appendChild(logoImg);
    header.appendChild(titleWrap);
    header.appendChild(closeBtn);
    panel.appendChild(header);

    // ── Mod list ──
    const list = document.createElement('div');
    list.style.cssText = 'padding:6px 6px 4px';

    (_mods.length ? _mods : [null]).forEach(mod => {
      if (!mod) {
        const empty = document.createElement('div');
        empty.textContent = 'no mods installed';
        empty.style.cssText = 'text-align:center;color:#444;font:11px Arial;padding:16px 0';
        list.appendChild(empty);
        return;
      }

      const card = document.createElement('div');
      card.className = 'wCard';
      card.style.cssText = [
        'display:flex', 'align-items:center', 'gap:10px',
        'padding:8px 10px', 'margin-bottom:4px',
        'background:#161620',
        'border:1px solid #252535',
        'border-radius:4px'
      ].join(';');

      const info = document.createElement('div');
      info.style.cssText = 'flex:1;min-width:0';

      const nameEl = document.createElement('div');
      nameEl.textContent = mod.name;
      nameEl.style.cssText = 'font:bold 12px Arial;color:#ccc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';

      const descEl = document.createElement('div');
      descEl.textContent = mod.description || '';
      descEl.style.cssText = 'font:10px Arial;color:#555;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';

      const metaEl = document.createElement('div');
      metaEl.textContent = 'v' + mod.version + ' by ' + (mod.author || '?');
      metaEl.style.cssText = 'font:9px Arial;color:#444;margin-top:2px';

      info.appendChild(nameEl);
      info.appendChild(descEl);
      info.appendChild(metaEl);

      card.appendChild(info);
      card.appendChild(_makeToggleEl(mod));
      list.appendChild(card);
    });

    panel.appendChild(list);
    document.body.appendChild(panel);
    _panelEl = panel;

    _panelEscHandler = e => { if (e.key === 'Escape') _closePanel(); };
    document.addEventListener('keydown', _panelEscHandler);
  }

  function _makeToggleEl(mod) {
    const track = document.createElement('div');
    const thumb = document.createElement('div');
    track.appendChild(thumb);
    track.style.cssText = 'width:38px;height:20px;border-radius:10px;flex-shrink:0;position:relative;cursor:pointer';

    function update() {
      const on = mod.enabled;
      track.style.background = on ? '#2d6a2d' : '#222230';
      track.style.border = '1px solid ' + (on ? '#3a8a3a' : '#333');
      thumb.style.cssText = [
        'width:14px', 'height:14px', 'border-radius:50%',
        'background:' + (on ? '#7c7' : '#555'),
        'position:absolute', 'top:2px',
        'left:' + (on ? '21px' : '2px'),
        'transition:left .1s'
      ].join(';');
    }

    update();
    track.onclick = () => { mod._api.toggle(); update(); };
    return track;
  }

  function _closePanel() {
    if (!_panelEl) return;
    _panelEl.remove();
    _panelEl = null;
    _panelOpen = false;
    if (_panelEscHandler) {
      document.removeEventListener('keydown', _panelEscHandler);
      _panelEscHandler = null;
    }
  }

  function _refreshPanel() {
    if (!_panelOpen) return;
    _closePanel();
    _openPanel();
  }

  function _buildMenuButton(scene) {
    const x = 40, y = 230;
    const BASE = 40;

    _menuBtn = scene.add.image(x, y, 'webode-logo')
      .setScrollFactor(0)
      .setDepth(30)
      .setDisplaySize(BASE, BASE)
      .setInteractive({ useHandCursor: true });

    // Store base scale after setDisplaySize so tweens use absolute values
    const bx = _menuBtn.scaleX, by = _menuBtn.scaleY;

    _menuBtn.on('pointerover', () => {
      scene.tweens.add({ targets: _menuBtn, scaleX: bx * 1.15, scaleY: by * 1.15, duration: 80 });
    });
    _menuBtn.on('pointerout', () => {
      scene.tweens.add({ targets: _menuBtn, scaleX: bx, scaleY: by, duration: 80 });
    });
    _menuBtn.on('pointerdown', () => {
      scene.tweens.add({
        targets: _menuBtn, scaleX: bx * 0.88, scaleY: by * 0.88,
        duration: 60, yoyo: true,
        onComplete: () => Webode.ui.openPanel()
      });
    });
  }

  window.Webode = Webode;
})();
