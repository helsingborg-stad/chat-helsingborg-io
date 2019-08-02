const Joi = require('@hapi/joi');
// const { id, limit } = require('../../validation/global.schema');

const querySchema = Joi.object().keys({
  userId: Joi.number().min(1).required(),
});

module.exports = {
  querySchema,
};
