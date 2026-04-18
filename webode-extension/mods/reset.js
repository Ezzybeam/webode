Webode.registerMod({
  id: 'reset',
  name: 'Quick Reset',
  version: '1.0.0',
  author: 'Webode',
  description: 'Press R to instantly restart the level',

  onLoad(api) {
    api.addKeybind('r', () => {
      if (Webode.scene && Webode.scene['_restartLevel']) {
        Webode.scene['_restartLevel']();
      }
    });
  },

  onEnable() {},
  onDisable() {}
});
