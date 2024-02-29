//function to send verification email to user

const nodemailer = require("nodemailer");
const { resource } = require("../constant");
require("dotenv").config();

const sendVerificationEmail = async (email, token) => {
  // create nodemailer transport
  const transporter = nodemailer.createTransport({
    //configure email services
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // compose email message
  const mailOptions = {
    from: resource.text.verificationEmailFrom,
    to: email,
    subject: resource.text.verificationEmailSubject,
    text:
      resource.text.VerificationEmailBody +
      `http://localhost:3001/verify/${token}`,
  };

  // send the email
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("error sending verification mail: ", error);
  }
};

module.exports = sendVerificationEmail;
