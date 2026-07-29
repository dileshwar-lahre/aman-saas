import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendOtpEmail({ email, otp, name, restaurantName, ownerName, role }) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error("GMAIL_USER ya GMAIL_APP_PASSWORD .env.local me missing hai!");
  }

  let greetingText = "";
  let subHeading = "";

  if (role === "restaurant") {
    greetingText = `Hello <b>${ownerName || "Partner"}</b> (Owner of <b>${restaurantName || "Restaurant"}</b>),`;
    subHeading = "Security Verification for Restaurant Portal";
  } else {
    greetingText = `Hello <b>${name || "User"}</b>,`;
    subHeading = "Security Verification for Customer Portal";
  }

  const mailOptions = {
    from: `"stonenox Security" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `🔐 ${otp} - Your stonenox Verification OTP`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 28px; border: 1px solid #E5E7EB; border-radius: 16px; max-width: 480px; margin: auto; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #000000; text-transform: uppercase; letter-spacing: 3px; margin: 0; font-weight: 900; font-size: 24px;">STONENOX</h2>
          <p style="color: #6B7280; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px;">${subHeading}</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #F3F4F6; margin: 20px 0;" />
        <p style="color: #111827; font-size: 15px; margin-bottom: 8px;">${greetingText}</p>
        <p style="color: #4B5563; font-size: 13px; line-height: 1.6; margin-top: 0;">
          Do not share this OTP with anyone for your account safety. Your OTP code is valid for <b>10 minutes</b>.
        </p>
        <div style="background: #F9FAFB; padding: 20px; text-align: center; border-radius: 16px; border: 1px dashed #D1D5DB; margin: 24px 0;">
          <span style="color: #FF9900; font-size: 40px; font-weight: 900; letter-spacing: 8px; display: block;">${otp}</span>
        </div>
        <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin-bottom: 24px;">
          If you didn't request this OTP, please ignore this email.
        </p>
        <hr style="border: 0; border-top: 1px solid #F3F4F6; margin: 20px 0;" />
        <div style="text-align: center; padding-top: 8px;">
          <p style="color: #000000; font-size: 12px; font-weight: 800; margin: 0; text-transform: uppercase; letter-spacing: 1px;">
            Powered by <a href="https://stonenox.com" target="_blank" style="color: #FF9900; text-decoration: none;">stonenox.com</a>
          </p>
          <p style="color: #9CA3AF; font-size: 10px; margin-top: 4px; font-family: monospace;">
            Secured by stonenox Node Engine
          </p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}