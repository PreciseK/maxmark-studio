import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (PAYSTACK_SECRET_KEY && signature) {
      const hash = crypto
        .createHmac("sha512", PAYSTACK_SECRET_KEY)
        .update(rawBody)
        .digest("hex");

      if (hash !== signature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);
    const admin = createAdminClient();

    switch (event.event) {
      case "charge.success": {
        const data = event.data;
        const ref = data.reference;
        const email = data.customer?.email;

        // Check if enrollment already exists for this reference
        const { data: existing } = await (admin as any)
          .from("academy_enrollments")
          .select("id")
          .eq("paystack_reference", ref)
          .single();

        if (!existing && email) {
          // If recurring charge on subscription, extend period
          const subCode = data.subscription?.subscription_code;
          if (subCode) {
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            await (admin as any)
              .from("academy_enrollments")
              .update({
                status: "active",
                current_period_end: nextMonth.toISOString(),
              })
              .eq("paystack_subscription_code", subCode);
          }
        }
        break;
      }

      case "subscription.disable": {
        const subCode = event.data?.subscription_code;
        if (subCode) {
          await (admin as any)
            .from("academy_enrollments")
            .update({ status: "cancelled" })
            .eq("paystack_subscription_code", subCode);
        }
        break;
      }

      case "invoice.payment_failed": {
        const subCode = event.data?.subscription?.subscription_code;
        if (subCode) {
          await (admin as any)
            .from("academy_enrollments")
            .update({ status: "past_due" })
            .eq("paystack_subscription_code", subCode);
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Paystack webhook error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
