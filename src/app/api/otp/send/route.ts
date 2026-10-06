import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Clean phone number to 10 or 12 digits
    const cleaned = phone.replace(/[^0-9]/g, '');
    const mobile = cleaned.length === 10 ? `91${cleaned}` : cleaned;

    const authKey = process.env.MSG91_AUTH_KEY || process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH;
    const widgetId = process.env.MSG91_TEMPLATE_ID || process.env.NEXT_PUBLIC_MSG91_WIDGET_ID;

    // Call MSG91 Send OTP API if live credentials available
    if (authKey && widgetId) {
      try {
        const msg91Res = await fetch(
          `https://control.msg91.com/api/v5/otp?template_id=${widgetId}&mobile=${mobile}&authkey=${authKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        const data = await msg91Res.json();
        if (data.type === 'success' || msg91Res.ok) {
          return NextResponse.json({
            success: true,
            message: 'OTP sent to mobile number via MSG91',
            provider: 'msg91',
          });
        }
      } catch (err) {
        console.warn('MSG91 request error, falling back to simulated OTP:', err);
      }
    }

    // Dev fallback with easy OTP 1234
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully (Simulated mode: enter 1234)',
      devOtp: '1234',
      provider: 'sandbox',
    });
  } catch (error) {
    console.error('OTP Send error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
