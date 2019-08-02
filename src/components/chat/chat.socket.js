/* eslint-disable no-shadow */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */

const log = require('../../utils/logger');
const { getConversation } = require('../conversation/conversation.dal');

/**
 *  @param {object} io Namespaced socket.io object
 *  @return void
 */
module.exports = (io) => {
  io.on('connection', (client) => {
    client.on('join', (data, clientResponseCallback) => {
      const { user } = client;
      const { agentId } = data;

      client.conversation = getConversation([user.id, agentId]);
      client.join(client.conversation.id);

      clientResponseCallback({
        data: {
          conversationId: client.conversation.id,
          messages: client.conversation.getMessages(),
          members: client.conversation.getMembers(),

        },
        status: 'success',
      });

      log.info(`Client (ID: ${client.id}) joined room ${client.conversation.id}`);
    });

    client.on('message', (message) => {
      const { conversation } = client;
      conversation.addMessage(message);
      io.to(conversation.id).emit('message', { data: { messages: conversation.getMessages() }, status: 'success' });
    });

    client.on('error', (err) => {
      log.error(err);
    });

    client.on('disconnect', () => {
      if (typeof client.conversation !== 'undefined') {
        client.leave(client.conversation.id);
        log.info(`Client left room: ${client.id}`);
      }
      log.info(`Client disconnected: ${client.id}`);
    });

    log.info(`Client connected: ${client.id}`);
  });
};
