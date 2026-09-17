const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log("✅ Email server connection successful");
    return true;
  } catch (error) {
    console.error("❌ Email server connection failed:");
    console.error(error.message);
    return false;
  }
}

async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"TravelHub" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email sent successfully:", info.messageId);

    return info;
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
}

module.exports = {
  sendEmail,
  verifyEmailConnection,
};