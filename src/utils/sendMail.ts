import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: true,
  auth: {
    user: process.env.SMTP_AUTH_USER,
    pass: process.env.SMTP_AUTH_PASS,
  },
});

export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
  const resetLink =
    `http://localhost:${process.env.PORT ?? 3000}/auth/reset-password?token=${token}`;
  await transporter.sendMail({
    from: `"Library App" <${process.env.SENDER_EMAIL}>`,
    to,
    subject: 'Password reset',
    text: `To reset your password follow the link (valid for 10 minutes):\n\n${resetLink}`,
    html: `<p>To reset your password follow the link (valid for 10 minutes):</p>
           <p><a href="${resetLink}">${resetLink}</a></p>`,
  });
}