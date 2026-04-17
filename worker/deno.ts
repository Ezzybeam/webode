// Deno Deploy proxy for GD level data
// Deploy at: dash.deno.com/playground — paste this, click Save & Deploy, copy the URL

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  const CORS = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (!id || !/^\d+$/.test(id)) return new Response(JSON.stringify({ error: 'missing id' }), { status: 400, headers: CORS });

  const gdRes = await fetch('https://www.boomlings.com/database/downloadGJLevel22.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'RobTopGames/42 CFNetwork/1410.0.3 Darwin/22.6.0' },
    body: 'levelID=' + id + '&secret=Wmfd2893gb7',
  });

  const text = await gdRes.text();
  if (!text || text.trim() === '-1') return new Response(JSON.stringify({ error: 'level not found' }), { status: 404, headers: CORS });

  const parts = text.split(':');
  let levelData = null;
  for (let i = 0; i < parts.length - 1; i++) {
    if (parts[i] === '4') { levelData = parts[i + 1]; break; }
  }
  if (!levelData) return new Response(JSON.stringify({ error: 'no level data', raw: text.slice(0, 200) }), { status: 404, headers: CORS });

  return new Response(JSON.stringify({ data: levelData }), { headers: CORS });
});
