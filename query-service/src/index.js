const { createProxyMiddleware } = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const CircularJSON = require('circular-json');

const router = require('./routes');

const app = express();

const routes = {
  '/api/concert': {
    GWPath: '/api/query/concert',
    api: 'http://concert-service:5001',
  },
  '/api/payment/create': {
    GWPath: '/api/query/payment/create',
    api: 'http://payment-service:5002',
  },
  '/api/reservation/create': {
    GWPath: '/api/query/reservation/create',
    api: 'http://reservation-service:5004',
  },
  '/api/pdf-convert/create': {
    GWPath: '/api/query/pdf-convert/create',
    api: 'http://pdf-converter-service:5003',
  },
};

for (const route in routes) {
  const target = routes[route].api;
  console.log('target', target);
  app.use(
    createProxyMiddleware([routes[route].GWPath], {
      target,
      logger: console,
      onProxyReq: (proxyReq, req, res) => {
        console.log(
          `Proxying  ${req.method} request from ${req.path} to ${target}${req.url}`
        );
        console.log('req body in proxy middleware', req.body);
        if (req.body) {
          let bodyData = CircularJSON.stringify(req.body);

          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          // stream the content
          proxyReq.write(bodyData);
        }
      },
      onError: (err, req, res) => {
        console.error(`Proxy Error: ${err.message}`);
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end('Proxy Error');
      },
      changeOrigin: true,
      pathRewrite: (path, req) => {
        console.log('path', path);
        console.log('req.body', req.body);

        if (
          path.includes('/api/query/concert') ||
          path.includes('/api/query/payment/create') ||
          path.includes('/api/query/reservation/create') ||
          path.includes('/api/query/pdf-convert/create')
        ) {
          return path.replace('/api/query', '/api');
        }

        return path;
      },
      logLevel: 'debug',
    })
  );
}

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const Startup = () => {
  try {
  } catch (e) {}
};

app.listen(5000, () => {
  console.log(`query-service listening on port 5000!!! `);
});

Startup();
