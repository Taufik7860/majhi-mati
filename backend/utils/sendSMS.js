import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

let client;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

export const sendSMS = async (to, message) => {
  if (!client) {
    console.log(`[Mock SMS Sent to ${to}]: ${message}`);
    return true;
  }

  try {
    await client.messages.create({
      body: message,
      from: fromPhone,
      to: to,
    });
    console.log(`✅ SMS successfully sent to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending SMS via Twilio:', error.message);
    return false;
  }
};