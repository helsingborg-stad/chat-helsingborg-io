

const { validate } = require('../validation/validation');
const { WeakValidationError, ValidationError } = require('../utils/error');
const logger = require('../utils/logger');

// Joi validation options
const validationOptions = {
  abortEarly: false, // abort after the last validation error
  allowUnknown: true, // allow unknown keys that will be ignored
  stripUnknown: true, // remove unknown keys from the validated data
};

/**
 * @param {Object} schema - the JOI Schema to validate against
 * @param {Boolean} detailedError - flag stating whether a detail error should be returned or not
 *
 * @returns {Function} the validation middleware for socket IO
 */
const socketMiddleware = (schema, field = 'query', detailedError = false) => (socket, next) => {
  const { handshake } = socket;
  validate(handshake[field], schema, validationOptions)
    .then((validated) => {
      handshake[field] = validated;
      next();
    })
    .catch((e) => {
      logger.error(e);

      const err = detailedError
        ? e
        : new WeakValidationError('Invalid request data. Please review request and try again.');

      next(err);
    });
};

module.exports = socketMiddleware;
