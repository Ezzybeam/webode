// ==UserScript==
// @name         Webode
// @namespace    https://github.com/ezzybeam/webode
// @version      1.0.0
// @description  Mod loader for Geometry Dash (web)
// @author       ezzybeam
// @match        https://www.geometrydash.com/game/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  const BASE = 'https://raw.githubusercontent.com/ezzybeam/webode/main';

  const files = [
    'webode.js',
    'mods/noclip.js',
    'mods/reset.js',
    'mods/hitboxes.js',
    'mods/speedhack.js',
    'mods/levels.js',
  ];

  for (const f of files) {
    const s = document.createElement('script');
    s.src = BASE + '/' + f;
    s.async = false;
    document.documentElement.appendChild(s);
  }
})();
