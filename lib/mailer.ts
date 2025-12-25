import nodemailer from "nodemailer";



export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT), 
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * Optional: Verify transporter in development
 */
if (process.env.NODE_ENV === "development") {
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ Mailer config error:", error);
    } else {
      console.log("✅ Mailer ready to send emails");
    }
  });
}
