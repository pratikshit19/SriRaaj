import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt, notes } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if real keys are configured (real keys start with rzp_test_ or rzp_live_ and are ~14+ chars)
    const isConfigured = keyId && keySecret && !keyId.includes('demo') && keyId.length > 10;

    if (isConfigured) {
      try {
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });

        const order = await razorpay.orders.create({
          amount: Math.round(amount * 100), // in paise
          currency,
          receipt: receipt || `rcpt_${Date.now()}`,
          notes: notes || {},
        });

        return NextResponse.json({
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          key: keyId,
          isDemo: false,
        });
      } catch (err: unknown) {
        console.warn('Razorpay API error, falling back to sandbox simulator:', err);
      }
    }

    // Dev/Sandbox fallback order for seamless testing
    const fallbackOrderId = `order_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 6)}`;
    return NextResponse.json({
      id: fallbackOrderId,
      amount: Math.round(amount * 100),
      currency: currency || 'INR',
      key: keyId || 'rzp_test_sriraaj_demo',
      isDemo: true,
      message: 'Order created in test sandbox mode. Provide real keys in .env.local to link live account.',
    });
  } catch (error: unknown) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
