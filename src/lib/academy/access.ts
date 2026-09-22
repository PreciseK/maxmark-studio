import { createClient } from "@/lib/supabase/server";

export type UserAccessResult = {
  hasAccess: boolean;
  accessType?: "lifetime" | "subscription" | "manual_grant";
  status?: "active" | "past_due" | "cancelled" | "expired";
  expiresAt?: string | null;
  tierId?: string | null;
};

/**
 * Checks if the currently authenticated user has active access to the Academy
 */
export async function checkCurrentUserAcademyAccess(): Promise<UserAccessResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { hasAccess: false };
  }

  // Check enrollments table
  const { data: enrollments, error } = await (supabase as any)
    .from("academy_enrollments")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error || !enrollments || enrollments.length === 0) {
    return { hasAccess: false };
  }

  const enrollment: any = enrollments[0];

  // If subscription, verify current_period_end is either null or in the future
  if (enrollment.access_type === "subscription" && enrollment.current_period_end) {
    const isExpired = new Date(enrollment.current_period_end).getTime() < Date.now();
    if (isExpired) {
      return {
        hasAccess: false,
        accessType: "subscription",
        status: "expired",
        expiresAt: enrollment.current_period_end,
      };
    }
  }

  return {
    hasAccess: true,
    accessType: enrollment.access_type,
    status: enrollment.status,
    expiresAt: enrollment.current_period_end,
    tierId: enrollment.tier_id,
  };
}
