const express = require('express');

// const person = require('./person/person.api');

const routes = () => {
  const router = express.Router();

  // Register route to api-layer.
  // router.use('/person', person());

  return router;
};


module.exports = routes;
