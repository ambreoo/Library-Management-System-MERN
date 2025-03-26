import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send an email
export const sendMail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"CUSV Library" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.log("Error sending email:", error);
  }
};
