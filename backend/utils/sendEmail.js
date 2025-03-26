import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
    //   user: process.env.EMAIL_USER, // Your email
    //   pass: process.env.EMAIL_PASS, // Your email password or App Password
        user: "yushinc1@uci.edu",
        pass: "382Cam1602",
    },
  });

  const mailOptions = {
    // from: process.env.EMAIL_USER,
    from: "yushinc1@uci.edu",
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
