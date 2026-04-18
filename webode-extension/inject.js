// Runs at document_start (isolated world) — injects mod scripts into the page
// before any HTML is parsed, so they're ready before index-game.js loads.
// async=false ensures they execute in order: webode first, then mods.

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
  s.src = chrome.runtime.getURL(f);
  s.async = false;
  document.documentElement.appendChild(s);
}
