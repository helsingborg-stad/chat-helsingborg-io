/* eslint-disable func-names */
const uuidv5 = require('uuid/v5');
const users = require('../user/user.db');

/**
 * Conversation object responsible for managing a conversation's messages/members etc
 * @param {*} members
 */
class Conversation {
  constructor(members) {
    this.members = members.map(id => (Number(id)));
    this.messages = [];
    this.getMessages = () => this.messages;
    this.getMessage = (args) => { };
    this.addMessage = (message) => {
      this.messages.push(message);
    };
    this.getMembers = () => users.filter(user => (this.members.includes(user.id)));
  }
}

/**
 * Temporary storage for conversations
 */
const conversations = {};

/**
 * Will attempt to locate and return an existing conversation
 * or create a new one and save it to the temporary storage based on user ID's
 * @param {array} members Array of user ID's
 * @return {object} Conversation object
 */
const getConversation = (members) => {
  members.sort((a, b) => a - b);
  const id = uuidv5(JSON.stringify(members), uuidv5.URL); // Generate ID based on users

  if (typeof conversations[id] !== 'undefined') {
    return conversations[id];
  }

  conversations[id] = new Conversation(members);
  conversations[id].id = id;

  return conversations[id];
};


module.exports = {
  getConversation,
  Conversation,
  conversations,
};
