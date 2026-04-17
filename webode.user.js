// ==UserScript==
// @name         Webode
// @namespace    https://github.com/ezzybeam/webode
// @version      1.0.0
// @description  Mod loader for Geometry Dash (web)
// @author       ezzybeam
// @match        https://www.geometrydash.com/game/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      boomlings.com
// ==/UserScript==

(function () {
  const BASE = 'https://raw.githubusercontent.com/ezzybeam/webode/main';

  // Expose a fetch helper that bypasses CORS using GM_xmlhttpRequest.
  // mods/levels.js uses window.GMFetch when available (Tampermonkey),
  // otherwise falls back to the worker proxy.
  window.GMFetch = function(url, opts) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: opts && opts.method || 'GET',
        url: url,
        headers: opts && opts.headers,
        data: opts && opts.body,
        onload: r => resolve({
          ok: r.status >= 200 && r.status < 400,
          json: () => Promise.resolve(JSON.parse(r.responseText)),
          text: () => Promise.resolve(r.responseText),
        }),
        onerror: e => reject(new Error('request failed')),
      });
    });
  };

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
