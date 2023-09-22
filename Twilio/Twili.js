// twilio.js

const twilio = require('twilio');

const accountSid = 'AC819965eb46884d7fa44f6c4863c6247b';
const authToken = 'f5c37a819b1b61a51bed49742fc35072';

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
