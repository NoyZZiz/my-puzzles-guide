import http from 'http';
import url from 'url';

const port = 3000;

// Helper to convert Node incoming message to Next-like req/res
async function handleRequest(req, res) {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname || '';

  // Simple router for /api/test and /api/characters endpoints
  if (pathname === '/api/test') {
    const mod = await import('./api/test.js');
    const handler = mod.default || mod.handler;

    if (handler) {
      const nextRes = Object.create(res);
      nextRes.status = (code) => { res.statusCode = code; return nextRes; };
      nextRes.json = (obj) => { if(!res.headersSent){ res.setHeader('Content-Type', 'application/json'); } res.end(JSON.stringify(obj)); };
      try {
        await handler(req, nextRes);
      } catch (err) {
        if (!res.headersSent) res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500; res.end(JSON.stringify({ error: err.message }));
      }
    } else {
      res.statusCode = 500; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ error: 'Handler not found' }));
    }
    return;
  }

  if (pathname === '/api/characters/claimed' || pathname === '/api/characters/claim') {
    // choose module based on pathname
    const modulePath = pathname.endsWith('/claimed') ? './api/characters/claimed.js' : './api/characters/claim.js';
    try {
      const mod = await import(modulePath);
      const handler = mod.default || mod.handler;
      if (handler) {
        const nextRes = Object.create(res);
        nextRes.status = (code) => { res.statusCode = code; return nextRes; };
        nextRes.json = (obj) => { if(!res.headersSent){ res.setHeader('Content-Type', 'application/json'); } res.end(JSON.stringify(obj)); };
        try {
          await handler(req, nextRes);
        } catch (err) {
          if (!res.headersSent) res.setHeader('Content-Type', 'application/json');
          res.statusCode = 500; res.end(JSON.stringify({ error: err.message }));
        }
        return;
      }
    } catch (err) {
      res.statusCode = 500; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ error: err.message }));
      return;
    }
  }
  else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Not found' }));
  }
}

const server = http.createServer((req, res) => {
  handleRequest(req, res);
});

server.listen(port, () => {
  console.log(`Dev API server running at http://localhost:${port}`);
});
