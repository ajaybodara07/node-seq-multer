const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const authyClient = require('authy-client').Client;
const authy = new authyClient({ key: process.env.TFA_API_KEY });

const mailSend = (req) => {
  try {
    const msg = {
      to: req.email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: req.sub,
      html: req.html,
    };
    sgMail.send(msg).then((mailData) => { console.log("mail sent") }, err => { console.log("error in mail sending: ", err) });
  } catch (err) {
    console.log("error in catch mail sending: ", err);
  }
};

const smsSend = (req) => {
  try {
    client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: req.phone,
      body: req.msgBody
    }).then((messsage) => { console.log("sms sent") }).catch(err => console.log("error in twilio sms: ", err));
  } catch (err) {
    console.log("error in catch SMS sending: ", err);
  }
};

module.exports = { mailSend, smsSend };