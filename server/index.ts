export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1')
      await new Promise((r) => setTimeout(r, 250));

    if (url.pathname.startsWith('/api/')) {
      await env.KV.put('last-api-call', `${Date.now()} ${request.method} ${url.pathname}`);

      return Response.json({
        timestamp: Date.now(),
        lastApiCall: await env.KV.get('last-api-call'),
      });
    }
    return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
