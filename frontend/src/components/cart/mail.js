const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "api",
    pass: "55f4ca3cee0df03e582b7984f88b2a6c",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'rathnajewellery@gmail.com', // sender address
    to: "sanjuga9099@gmail.com", // list of receivers
    subject: "Confirmation mail", // Subject line
    text: "Hello world", // plain text body
    
  });

  console.log("Message sent: %s", info.messageId);}