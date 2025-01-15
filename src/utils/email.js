/**
 * 
 * Provides functionality to send emails via SMTP or a third-party service like SendGrid, Mailgun, etc.
 */

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // Example using Gmail SMTP:
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // e.g. youraddress@gmail.com
    pass: process.env.EMAIL_PASS, // app-specific password
  },
});

/**
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text email body
 * @param {string} html - HTML email body
 */
exports.sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
