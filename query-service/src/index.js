// const {TICKET_API_URL} = require('./URLs')

const { createProxyMiddleware } = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const CircularJSON = require('circular-json');
const prometheus = require('prom-client');
const os = require('os');

const httpRequestCounter = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status'],
});

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
  console.log('targetf', target);
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

          // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          // stream the content
          proxyReq.write(bodyData);
        }
      },
      onError: (err, req, res) => {
        console.error(`Proxy Error: ${err.message}`);
        // Optionally, you can also log additional information about the request, like req.url, req.headers, etc.
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end('Proxy Error');
      },
      changeOrigin: true,
      // pathRewrite: {
      //   "^/api/query/concert": "/api/concert",
      //   "^/api/query/payment/create": "/api/payment/create",
      //   "^/api/query/reservation/create": "/api/reservation/create",
      //   "^/api/query/pdf-convert/create": "/api/pdf-convert/create",
      // },
      pathRewrite: (path, req) => {
        console.log('1 path', path);
        console.log('1 req.body', req.body);
        // Check if the request is for the /api/concert endpoint
        if (path.includes('/api/query/concert')) {
          // Check if the request has an 'id' parameter
          const id = path.split('/').at(-1);
          console.log('id 1', id);
          // If 'id' is present, include it in the rewritten path
          if (id) {
            return path.replace('/api/query/concert', `/api/concert`);
          }
        } else if (
          path.includes('/api/query/payment/create') ||
          path.includes('/api/query/reservation/create') ||
          path.includes('/api/query/pdf-convert/create')
        ) {
          // For /api/query/payment/create, remove the '/query' part
          return path.replace('/api/query', '/api');
        }

        // For other paths, leave them unchanged
        return path;
      },
      logLevel: 'debug',
      // selfHandleResponse: true,
    })
  );
  // app.use(
  //   `/api/query/${route}`,
  //   createProxyMiddleware({
  //     target,
  //     onProxyReq: (proxyReq, req, res) => {
  //       console.log(`Proxying request from ${req.path} to ${target}`);
  //     },
  //   }),
  // );
}

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// app.use("/api", router);

// http://concert-service:5001/api/concert
// http://payment-service:5002/api/payment/create/
// http://reservation-service:5004/api/reservation/create/
// http://pdf-converter-service:5003/api/pdf-convert/create/

const Startup = () => {
  try {
  } catch (e) {}
};

app.listen(5000, () => {
  console.log(`query-service listening on port 5000!!! `);
  console.log('Updated code ');
});

Startup();
