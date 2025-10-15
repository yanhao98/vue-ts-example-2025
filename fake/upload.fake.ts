// fake/user.fake.ts
import { defineFakeRoute } from 'vite-plugin-fake-server/client';

let fail = !false;
export default defineFakeRoute([
  {
    method: 'POST',
    rawResponse(req, res) {
      fail = !fail;
      if (fail) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Upload failed' }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ url: 'https://picsum.photos/200/300' }));
      }
    },
    response: () => {
      return {
        url: 'https://picsum.photos/200/300',
      };
    },
    timeout: 2000,
    url: '/fake/upload',
  },
]);
