export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 本地开发环境延迟处理
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      await new Promise((r) => setTimeout(r, 250));
    }

    // API 路由处理
    if (url.pathname.startsWith('/api/')) {
      await env.KV.put(
        'events:api:last-call',
        `${new Date().toISOString()} ${request.method} ${url.pathname}`,
      );

      // 获取所有可用的键名
      const availableKeys = [
        'events:api:last-call',
        'events:ws:connection',
        'events:ws:message',
        'events:ws:disconnection',
      ];

      return Response.json({
        timestamp: Date.now(),
        lastApiCall: await env.KV.get('events:api:last-call'),
        availableKeys: availableKeys,
        storedData: {
          apiLastCall: await env.KV.get('events:api:last-call'),
          wsConnection: await env.KV.get('events:ws:connection'),
          wsMessage: await env.KV.get('events:ws:message'),
          wsDisconnection: await env.KV.get('events:ws:disconnection'),
        },
      });
    }

    // WebSocket 连接处理
    if (url.pathname === '/ws') {
      const upgradeHeader = request.headers.get('Upgrade');
      if (upgradeHeader !== 'websocket') {
        return new Response('Expected websocket', { status: 400 });
      }

      const [client, server] = Object.values(new WebSocketPair());

      // 处理服务器端WebSocket消息
      server.accept();
      env.KV.put('events:ws:connection', `${new Date().toISOString()} ${url.pathname}`);

      // accept 后立即发送欢迎消息
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        await new Promise((r) => setTimeout(r, 250));
      }

      server.send(
        `欢迎连接到WebSocket服务器！连接时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`,
      );

      server.addEventListener('message', async (event) => {
        console.log('收到客户端消息:', event.data);
        await env.KV.put('events:ws:message', `${new Date().toISOString()} ${event.data}`);

        // 回复消息给客户端
        if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
          await new Promise((r) => setTimeout(r, 250));
        }

        server.send(
          `服务器收到: ${event.data} (时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })})`,
        );
      });

      server.addEventListener('close', () => {
        console.log('WebSocket连接关闭');
        env.KV.put('events:ws:disconnection', `${new Date().toISOString()} ${url.pathname}`);
        server.close();
      });

      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }

    return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
