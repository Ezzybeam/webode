Webode.registerMod({
  id: 'hitboxes',
  name: 'Show Hitboxes',
  version: '1.0.0',
  author: 'ezzybeam',
  description: 'Draw collision boxes — keybind H',

  onLoad(api) {
    api.addKeybind('h', () => api.toggle());
  },

  onEnable() {
    const scene = Webode.scene;
    if (!scene) return;
    this._g = scene.add.graphics();
    this._g.setScrollFactor(0).setDepth(999);
    this._fn = () => this._draw();
    scene.events.on('postupdate', this._fn);
  },

  onDisable() {
    if (this._g) { this._g.destroy(); this._g = null; }
    if (this._fn && Webode.scene) {
      Webode.scene.events.off('postupdate', this._fn);
      this._fn = null;
    }
  },

  // Draw a rectangle, optionally rotated, using fillPoints/strokePoints.
  // rot is in degrees, clockwise (Phaser/GD convention, Y-down screen space).
  _drawRect(g, cx, cy, w, h, rot) {
    if (!rot) {
      g.fillRect(cx - w / 2, cy - h / 2, w, h);
      g.strokeRect(cx - w / 2, cy - h / 2, w, h);
      return;
    }
    const rad = rot * Math.PI / 180;
    const cosA = Math.cos(rad);
    const sinA = Math.sin(rad);
    const hw = w / 2, hh = h / 2;
    // Rotate each corner around center; Y-down clockwise rotation:
    //   x' = px*cos - py*sin   y' = px*sin + py*cos
    const pts = [
      { x: cx + (-hw) * cosA - (-hh) * sinA, y: cy + (-hw) * sinA + (-hh) * cosA },
      { x: cx + ( hw) * cosA - (-hh) * sinA, y: cy + ( hw) * sinA + (-hh) * cosA },
      { x: cx + ( hw) * cosA - ( hh) * sinA, y: cy + ( hw) * sinA + ( hh) * cosA },
      { x: cx + (-hw) * cosA - ( hh) * sinA, y: cy + (-hw) * sinA + ( hh) * cosA },
    ];
    g.fillPoints(pts, true);
    g.strokePoints(pts, true);
  },

  _draw() {
    const g = this._g;
    const scene = Webode.scene;
    if (!g || !scene) return;
    const level = scene['_level'];
    if (!level || !level['objects']) return;

    // The game moves _level containers (container.x = -_cameraX) instead of using
    // real Phaser camera scroll. So cameras.main.scrollX is always 0.
    // We must manually subtract _cameraX to convert world → screen X.
    const camX = scene['_cameraX'] || 0;
    const camY = scene['_cameraY'] || 0;
    // T=460 is the game's internal height constant used by b(y)=T-y — NOT scene.scale.height
    // (the canvas may be CSS-scaled up, making scale.height larger and shifting boxes down)
    const H = 460;
    const screenW = scene.scale.width;
    const minX = camX - 60;
    const maxX = camX + screenW + 60;

    g.clear();

    const COLOR = {
      solid:   0x22ff44,
      hazard:  0xff2222,
      pad:     0xffee00,
      ring:    0xff8800,
      portal:  0x00ccff,
      gravity: 0xaa44ff,
      speed:   0xffffff,
      fly:     0x44aaff,
      cube:    0x44aaff,
    };

    for (const obj of level['objects']) {
      // Cull objects outside the visible world-X range
      if (obj['x'] + obj['w'] / 2 < minX || obj['x'] - obj['w'] / 2 > maxX) continue;

      const col = COLOR[obj['type']] || 0xcccccc;
      // Convert world coords → screen center of the hitbox
      const cx = obj['x'] - camX;
      const cy = (H - obj['y']) + camY;
      const rot = obj['rot'] || 0;

      g.fillStyle(col, 0.15);
      g.lineStyle(1.5, col, 0.85);
      this._drawRect(g, cx, cy, obj['w'], obj['h'], rot);
    }

    // Player hitboxes — player screen X = width/2 - 150 (the game's `h` constant)
    const state = Webode.state;
    if (state != null) {
      const px = screenW / 2 - 150;
      const py = (H - state['y']) + camY;

      // Outer 60x60 box — used for all AABB checks (hazard death, solid overlap)
      g.lineStyle(2, 0x00ffff, 0.9);
      g.strokeRect(px - 30, py - 30, 60, 60);

      // Inner 18x18 box — triggers death when side-hitting a solid block
      g.lineStyle(2, 0xff4444, 1);
      g.strokeRect(px - 9, py - 9, 18, 18);
    }
  }
});
