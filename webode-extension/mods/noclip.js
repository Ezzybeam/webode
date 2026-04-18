Webode.registerMod({
  id: 'noclip',
  name: 'No Clip',
  version: '1.0.0',
  author: 'Webode',
  description: 'Pass through all obstacles',

  onLoad(api) {
    api.addKeybind('z', () => api.toggle());
  },

  // Patch killPlayer at runtime so noclip works without index-game.js edits
  // (needed for Tampermonkey install where we can't replace index-game.js)
  _sceneReady(scene) {
    if (scene['killPlayer'].__noclipPatched) return;
    const orig = scene['killPlayer'].bind(scene);
    scene['killPlayer'] = function() {
      if (window._gdNoClip) return;
      return orig();
    };
    scene['killPlayer'].__noclipPatched = true;
  },

  onEnable() {
    window._gdNoClip = true;
  },

  onDisable() {
    window._gdNoClip = false;
  }
});
