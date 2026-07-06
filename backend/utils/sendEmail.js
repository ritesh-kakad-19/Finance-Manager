const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  let user = process.env.EMAIL_USER;
  let pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    // Generate test account automatically
    const testAccount = await nodemailer.createTestAccount();
    user = testAccount.user;
    pass = testAccount.pass;
    console.log("Using generated Ethereal email credentials:", user, pass);
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.ethereal.email",
    port: process.env.EMAIL_PORT || 587,
    auth: {
      user: user,
      pass: pass,
    },
  });

  const mailOptions = {
    from: "Finance Manager <noreply@financemanager.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;
