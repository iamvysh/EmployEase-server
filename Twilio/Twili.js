// twilio.js

const twilio = require('twilio');

const accountSid = 'AC819965eb46884d7fa44f6c4863c6247b';
const authToken = 'b6c22d8ff1066cc52ffe93cac0a02c63';

const client = new twilio(accountSid, authToken);

const sendSMS = (phoneNumber, message) => {
  return client.messages.create({
    body: message,
    to: phoneNumber,
    from: '+13305972173',
  });
};

module.exports = {
  sendSMS
};
