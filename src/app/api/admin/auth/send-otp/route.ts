import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().get(name)?.value;
          }
        }
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const email = user.email;
    if (!email) {
      return NextResponse.json({ success: false, error: 'No email associated with account' }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: dbError } = await supabase
      .from('admin_otps')
      .insert([{ email, otp, expires_at: expiresAt }]);

    if (dbError) throw dbError;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Admin Password Reset OTP</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f6f6f6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .header { background: #1E1B24; padding: 30px 20px; text-align: center; }
        .header h1 { color: #C59A4E; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px; }
        .content { padding: 40px 30px; text-align: center; color: #333333; }
        .otp-box { background: #FAF8F5; border: 1px solid #EBE5DB; border-radius: 12px; padding: 20px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1E1B24; margin: 30px 0; }
        .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #999999; font-size: 12px; border-top: 1px solid #eeeeee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>JAINSAATHI ADMIN</h1>
        </div>
        <div class="content">
          <h2 style="margin-top: 0;">Password Change Request</h2>
          <p>We received a request to change the password for your administrative account. Please use the verification code below to authorize this change.</p>
          <div class="otp-box">${otp}</div>
          <p style="font-size: 13px; color: #666;">This code is valid for 10 minutes. If you did not request this change, please ignore this email.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} JainSaathi Platform. All rights reserved.
        </div>
      </div>
    </body>
    </html>
    `;

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail({
        from: '"JainSaathi Admin Security" <security@jainsaathi.com>',
        to: email,
        subject: "Your Admin Password Change OTP",
        html: htmlContent,
      });
    } else {
      console.log('No SMTP credentials. OTP generated:', otp);
      return NextResponse.json({ success: true, message: 'OTP sent (Dev mode: check console)' });
    }

    return NextResponse.json({ success: true, message: 'OTP sent to email' });

  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
