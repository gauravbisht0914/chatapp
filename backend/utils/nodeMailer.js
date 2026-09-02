import nodemailer from "nodemailer";

const nodeMailertransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  encryption: "tls",
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendOtpForPasswordResetRequest(to = "",resetToken = "") {
  try {
    if (!to) {
      throw new Error("Recipient email address is required");
    }
    const info = await nodeMailertransporter.sendMail({
      from: '"ChatApp Team" <chatApp@gmail.com>',
      to,
      subject: "Password Reset OTP",
      html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Reset OTP</title>
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        font-family: Arial, sans-serif;
      ">
        <div style="
          max-width: 500px;
          margin: 40px auto;
          background: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        ">

          <h2 style="
            margin-top: 0;
            text-align: center;
            color: #222;
          ">
            Reset Your Password
          </h2>

          <p style="color: #555; font-size: 15px;">
            We received a request to reset your password.
            Use the verification code below to continue.
          </p>

          <div style="
            margin: 30px 0;
            text-align: center;
          ">
            <span style="
              display: inline-block;
              padding: 15px 25px;
              background-color: #f1f5f9;
              border-radius: 8px;
              font-size: 30px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #111;
            ">
              ${resetToken}
            </span>
          </div>

          <p style="
            text-align: center;
            color: #777;
            font-size: 14px;
          ">
            This OTP will expire in <strong>10 minutes</strong>.
          </p>

          <p style="
            color: #555;
            font-size: 14px;
            margin-top: 25px;
          ">
            If you didn't request a password reset, you can safely ignore
            this email.
          </p>

          <hr style="
            border: none;
            border-top: 1px solid #eee;
            margin: 25px 0;
          ">

          <p style="
            text-align: center;
            color: #999;
            font-size: 12px;
          ">
            © 2026 Your App. All rights reserved.
          </p>

        </div>
      </body>
    </html>
  `,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
}

export { sendOtpForPasswordResetRequest, nodeMailertransporter };
