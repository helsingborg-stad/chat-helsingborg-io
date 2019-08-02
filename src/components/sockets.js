const chat = require('./chat/chat.socket');
const validate = require('../middlewares/validator.socket');
const authClient = require('../middlewares/auth.client.middleware');
const { querySchema } = require('./chat/chat.schema');

module.exports = (io, SOCKET_BASE_PREFIX) => {
  // Define namespaces here as key:namespace value:callback
  const sockets = {
    '/chat': chat,
  };

  // Init sockets
  Object.entries(sockets).forEach(([socketNamespace, socketInit]) => {
    const IO = io.of(`${SOCKET_BASE_PREFIX}${socketNamespace}`);

    // Common middlewares
    IO.use(validate(querySchema, 'query', true));
    IO.use(authClient);

    socketInit(IO);
  });
};
