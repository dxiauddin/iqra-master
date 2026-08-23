import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Use a Google App Password
  },
});

export async function sendVerificationEmail(email: string, code: string) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #111;">Password Reset Verification</h2>
      <p>You have requested to reset your password. Use the secure verification code below:</p>
      <div style="font-size: 28px; font-weight: bold; background: #f8fafc; color: #0f172a; padding: 14px; text-align: center; letter-spacing: 6px; border-radius: 6px; margin: 20px 0; border: 1px solid #cbd5e1;">
        ${code}
      </div>
      <p style="color: #64748b; font-size: 13px;">This code will expire strictly in 5 minutes. If you did not request this change, please ignore this email immediately.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Security Team" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Secure Password Reset Code',
    html: htmlContent,
  });
}