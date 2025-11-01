import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'SchoolBridge <onboarding@resend.dev>',
      to: [email],
      subject: 'Verify your email address',
      html: `
        <h2>Welcome to SchoolBridge!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });
    console.log('✅ Verification email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    throw error;
  }
}

export async function sendOTPEmail(email: string, otp: string) {
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'SchoolBridge <onboarding@resend.dev>',
      to: [email],
      subject: 'Your verification code',
      html: `
        <h2>Welcome to SchoolBridge!</h2>
        <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
        <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="font-size: 32px; letter-spacing: 8px; margin: 0; font-family: monospace; color: #1f2937;">${otp}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      `,
    });
    console.log('✅ Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error);
    throw error;
  }
}