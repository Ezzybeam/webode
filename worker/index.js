// Cloudflare Worker — GD level proxy
// Deploy at: https://dash.cloudflare.com → Workers → Create Worker → paste this → Deploy
// Then set WORKER_URL in mods/levels.js to your worker's URL

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id || !/^\d+$/.test(id)) {
      return resp(400, { error: 'missing id' });
    }

    // Fetch from GD server
    const gdRes = await fetch('https://www.boomlings.com/database/downloadGJLevel22.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0',
      },
      body: `levelID=${id}&secret=Wmfd2893gb7`,
    });

    const text = await gdRes.text();
    if (!text || text === '-1') return resp(404, { error: 'level not found' });

    // Parse GD response format: 1:value:2:value:3:levelData:...
    const parts = text.split(':');
    let levelData = null;
    for (let i = 0; i < parts.length - 1; i++) {
      if (parts[i] === '4') { levelData = parts[i + 1]; break; }
    }
    if (!levelData) return resp(404, { error: 'no level data' });

    return resp(200, { data: levelData });
  }
};

function resp(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
