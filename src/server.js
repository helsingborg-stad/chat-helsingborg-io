/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const fs = require('fs');
const path = require('path');
const pino = require('express-pino-logger');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');

const app = require('express')();
const https = require('https');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const swaggerDocument = require('../swagger/swagger.js');
const routes = require('./components/routes');
const logger = require('./utils/logger');
const sockets = require('./components/sockets');

/**
 * Config
 */
const { SERVER_PORT } = process.env;
const API_BASE = '/api/v1';
const SOCKET_BASE = '/socket/v1';

/**
 * Init App
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Request logging
app.use(pino({ logger }));

// Add routes to the app.
app.get('/', (req, res) => res.send('Hello World!'));
app.use(API_BASE, routes());

// Init Sockets
sockets(io, SOCKET_BASE);

// Swagger for documenting the api, access through localhost:xxxx/api-docs.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Listen on port specfied in env-file.
http.listen({ port: SERVER_PORT }, async () => {
  logger.info(`Server started on port ${SERVER_PORT}`);
});

// Export server to use it in tests.
module.exports = http;
