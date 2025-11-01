import { NextRequest, NextResponse } from 'next/server';
  import { auth } from '@/auth';
  import prisma from '@/lib/prisma';
  import crypto from 'crypto';
  import { sendVerificationEmail } from '@/lib/email';

  export async function POST(request: NextRequest) {
    try {
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, email: true, emailVerified: true },
      });

      if (!user?.email) {
        return NextResponse.json(
          { message: 'No email address found' },
          { status: 400 }
        );
      }

      if (user.emailVerified) {
        return NextResponse.json(
          { message: 'Email already verified' },
          { status: 400 }
        );
      }

      // Generate token
      const token = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      // Store token (expires in 24 hours)
      await prisma.verificationToken.create({
        data: {
          identifier: user.email,
          token: hashedToken,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      // Send email
      await sendVerificationEmail(user.email, token);

      return NextResponse.json({
        message: 'Verification email sent',
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      return NextResponse.json(
        { message: 'Failed to send verification email' },
        { status: 500 }
      );
    }
  }