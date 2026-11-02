export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*'
    };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (origin !== env.ALLOWED_ORIGIN) return new Response('Forbidden', { status: 403 });
    const url = new URL(req.url);
    const ok = /^\/(person\/popular|search\/movie|configuration|movie\/\d+\/credits|person\/\d+\/movie_credits)$/;
    if (req.method !== 'GET' || !ok.test(url.pathname)) return new Response('Not found', { status: 404, headers: cors });
    const t = new URL('https://api.themoviedb.org/3' + url.pathname);
    url.searchParams.forEach((v, k) => { if (k !== 'api_key') t.searchParams.set(k, v); });
    const r = await fetch(t, { headers: { Authorization: 'Bearer ' + env.TMDB_TOKEN } });
    return new Response(r.body, { status: r.status, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
};
