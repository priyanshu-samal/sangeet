import config from "../config/config.js";
import nodeMailer from "nodemailer";

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    clientId: config.emailClientId,
    clientSecret: config.emailClientSecret,
    refreshToken: config.emailRefreshToken,
    user: config.emailUser,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("Error setting up email transporter:", error);
  } else {
    console.log("Email transporter is ready to send emails.");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Sangeet" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    // console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};




export {sendEmail};
