/* eslint-disable no-param-reassign */
const users = require('../components/user/user.db');

module.exports = (socket, next) => {
  const { userId } = socket.handshake.query;
  socket.user = users.filter(user => (Number(userId) === Number(user.id)));
  socket.user = socket.user.length > 0 ? socket.user[0] : false;

  if (!socket.user) {
    next(new Error('User not found'));
    return;
  }

  next();
};
