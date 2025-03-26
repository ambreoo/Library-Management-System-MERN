import nodemailer from 'nodemailer';
import mailgun from 'mailgun-js';

// Your Mailgun API key and domain
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
})

// Nodemailer transport using Mailgun
const transporter = nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: 'api',
    pass: process.env.MAILGUN_API_KEY,
  },
});

// Function to send email
const sendMail = async (to, subject, text) => {
  try {
    // Sending email using Mailgun with Nodemailer
    const info = await transporter.sendMail({
      from: 'postmaster@sandbox7f73163222dd43c49b76ed4a0b5503df.mailgun.org',
      to,
      subject,
      text,
    });

    console.log('Message sent:', info.messageId);
  } catch (error) {
    console.log('Error sending email:', error);
  }
};