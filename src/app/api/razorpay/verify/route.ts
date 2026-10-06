import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      isDemo,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json({ error: 'Missing payment parameters' }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If sandbox / demo mode
    if (isDemo || !keySecret || keySecret === 'sriraaj_secret_test') {
      return NextResponse.json({
        success: true,
        verified: true,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        status: 'captured',
        isDemo: true,
      });
    }

    // Verify HMAC SHA256 signature for real Razorpay transactions
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid = generatedSignature === razorpay_signature;

    if (isValid) {
      return NextResponse.json({
        success: true,
        verified: true,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        status: 'captured',
        isDemo: false,
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Signature verification failed' },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
