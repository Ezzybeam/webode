// Cloudflare Worker — GD level proxy
// Paste this directly into the Cloudflare Workers dashboard editor and click Deploy.

addEventListener('fetch', event => {
  event.respondWith(handle(event.request));
});

async function handle(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id || !/^\d+$/.test(id)) {
    return cors(400, { error: 'missing id' });
  }

  const gdRes = await fetch('https://www.boomlings.com/database/downloadGJLevel22.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'RobTopGames/42 CFNetwork/1410.0.3 Darwin/22.6.0',
    },
    body: 'levelID=' + id + '&secret=Wmfd2893gb7',
  });

  const text = await gdRes.text();
  if (!text || text === '-1') return cors(404, { error: 'level not found' });

  // GD response format: 1:value:2:value:4:levelData:...
  const parts = text.split(':');
  let levelData = null;
  for (let i = 0; i < parts.length - 1; i++) {
    if (parts[i] === '4') { levelData = parts[i + 1]; break; }
  }
  if (!levelData) return cors(404, { error: 'no level data', raw: text.slice(0, 500) });

  return cors(200, { data: levelData });
}

function cors(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
