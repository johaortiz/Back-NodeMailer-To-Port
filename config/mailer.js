const nodemailer = require("nodemailer");
require("dotenv").config();
const { EMAIL, PASSWORD } = process.env;

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: EMAIL, // generated ethereal user
    pass: PASSWORD, // generated ethereal password
  },
});

transporter.verify(() => {
  console.log("Ready for send emails");
});

module.exports = transporter;
