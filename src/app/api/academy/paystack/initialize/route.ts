import { NextRequest, NextResponse } from "next/server";
import { initializePaystackPayment } from "@/lib/academy/paystack";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tierId, email, name } = body;

    if (!tierId || !email) {
      return NextResponse.json(
        { error: "Tier ID and Email are required" },
        { status: 400 }
      );
    }

    // Determine amount based on tier
    let amountKobo = 15000000; // 150,000 NGN default for lifetime
    let planCode: string | undefined = undefined;

    if (tierId === "subscription_monthly") {
      amountKobo = 2500000; // 25,000 NGN
      planCode = process.env.PAYSTACK_MONTHLY_PLAN_CODE;
    } else if (tierId === "subscription_yearly") {
      amountKobo = 20000000; // 200,000 NGN
      planCode = process.env.PAYSTACK_YEARLY_PLAN_CODE;
    }

    // Check if user is logged in
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id || "guest";

    const origin = req.nextUrl.origin;
    const callbackUrl = `${origin}/academy/checkout?status=callback&tier=${tierId}`;

    const paymentResult = await initializePaystackPayment({
      email,
      amountKobo,
      callbackUrl,
      tierId,
      userId,
      planCode,
    });

    if (!paymentResult.status || !paymentResult.data) {
      return NextResponse.json(
        { error: paymentResult.message || "Failed to initialize payment" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      authorizationUrl: paymentResult.data.authorization_url,
      reference: paymentResult.data.reference,
    });
  } catch (error: any) {
    console.error("Paystack init error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
