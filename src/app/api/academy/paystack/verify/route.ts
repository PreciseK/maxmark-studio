import { NextRequest, NextResponse } from "next/server";
import { verifyPaystackPayment } from "@/lib/academy/paystack";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json({ error: "Reference is required" }, { status: 400 });
    }

    const verification = await verifyPaystackPayment(reference);

    if (!verification.status || verification.data?.status !== "success") {
      return NextResponse.json(
        { error: "Payment verification failed or pending" },
        { status: 400 }
      );
    }

    const data = verification.data;
    const userEmail = data.customer.email;
    const tierId = data.metadata?.tierId || "lifetime";

    // 1. Get current logged in user or look up user by email
    const supabase = await createClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    let targetUserId = currentUser?.id;

    // Use admin client to query/create auth user if guest
    const admin = createAdminClient();

    if (!targetUserId) {
      // Find or create user via admin
      const { data: usersList } = await admin.auth.admin.listUsers();
      const existingUser = usersList?.users?.find(
        (u) => u.email?.toLowerCase() === userEmail.toLowerCase()
      );

      if (existingUser) {
        targetUserId = existingUser.id;
      } else {
        // Create user with random initial password and confirmed email
        const tempPassword = `Maxmark_${Math.random().toString(36).substring(2, 10)}!`;
        const { data: newUser } = await admin.auth.admin.createUser({
          email: userEmail,
          password: tempPassword,
          email_confirm: true,
          user_metadata: { role: "student" },
        });
        targetUserId = newUser.user?.id;
      }
    }

    if (!targetUserId) {
      return NextResponse.json(
        { error: "Could not associate student account with payment" },
        { status: 500 }
      );
    }

    // 2. Calculate current_period_end if subscription
    let currentPeriodEnd: string | null = null;
    let accessType: "lifetime" | "subscription" = "lifetime";

    if (tierId === "subscription_monthly") {
      accessType = "subscription";
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      currentPeriodEnd = nextMonth.toISOString();
    } else if (tierId === "subscription_yearly") {
      accessType = "subscription";
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      currentPeriodEnd = nextYear.toISOString();
    }

    // 3. Upsert enrollment record
    const { error: enrollError } = await (admin as any)
      .from("academy_enrollments")
      .insert({
        user_id: targetUserId,
        user_email: userEmail,
        tier_id: tierId,
        access_type: accessType,
        status: "active",
        paystack_reference: reference,
        paystack_customer_code: data.customer.customer_code,
        paystack_subscription_code: data.subscription?.subscription_code || null,
        current_period_end: currentPeriodEnd,
      });

    if (enrollError) {
      console.error("Error creating academy enrollment:", enrollError);
    }

    return NextResponse.json({
      success: true,
      message: "Enrollment activated successfully",
      redirectUrl: "/academy/learn",
    });
  } catch (error: any) {
    console.error("Verification endpoint error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
