import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export default async function AdminEnrollmentsPage() {
  const supabase = await createClient();

  // Fetch enrollments
  const { data: enrollments } = await (supabase as any)
    .from("academy_enrollments")
    .select("*")
    .order("created_at", { ascending: false });

  // Server Action to grant manual access to a student email
  async function grantManualAccess(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const accessType = (formData.get("accessType") as string) || "lifetime";

    if (!email) return;

    const admin = createAdminClient();

    // Check if user exists or create
    const { data: usersList } = await admin.auth.admin.listUsers();
    let user = usersList?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      const tempPass = `Student_${Math.random().toString(36).substring(2, 8)}!`;
      const { data: created } = await admin.auth.admin.createUser({
        email,
        password: tempPass,
        email_confirm: true,
      });
      user = created.user as any;
    }

    if (user) {
      await (admin as any).from("academy_enrollments").insert({
        user_id: user.id,
        user_email: email,
        access_type: accessType,
        status: "active",
        paystack_reference: `manual_grant_${Date.now()}`,
      });
    }

    revalidatePath("/admin/academy/enrollments");
  }

  return (
    <div className="space-y-10 max-w-5xl">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6 space-y-2">
        <Link
          href="/admin/academy"
          className="text-xs font-mono uppercase text-neutral-400 hover:text-white transition-colors"
        >
          ← Back to Academy Overview
        </Link>
        <h1 className="text-2xl font-bold text-white">Student Enrollments & Access</h1>
        <p className="text-xs text-neutral-400">
          Monitor verified Paystack enrollments and manually grant access to VIPs or team members.
        </p>
      </div>

      {/* Grant Manual Access Form */}
      <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-[#E3FF39]">
          GRANT MANUAL VIP ENROLLMENT
        </h2>
        <form action={grantManualAccess} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            name="email"
            placeholder="student@example.com"
            className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-[#E3FF39]"
          />
          <select
            name="accessType"
            className="px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-[#E3FF39]"
          >
            <option value="lifetime">Lifetime All-Access</option>
            <option value="subscription">Monthly Subscription</option>
          </select>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-[#E3FF39] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#d6f030]"
          >
            Grant Access
          </button>
        </form>
      </div>

      {/* Enrollments Table */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
          ACTIVE ENROLLMENTS ({enrollments?.length || 0})
        </h2>

        {enrollments && enrollments.length > 0 ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-800 bg-neutral-900/80 text-[10px] font-mono uppercase text-neutral-400">
                <tr>
                  <th className="p-4">Student Email</th>
                  <th className="p-4">Access Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Paystack Ref</th>
                  <th className="p-4">Enrolled At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono text-neutral-300">
                {enrollments.map((e: any) => (
                  <tr key={e.id} className="hover:bg-neutral-800/20">
                    <td className="p-4 font-sans font-medium text-white">{e.user_email}</td>
                    <td className="p-4 uppercase text-[#E3FF39]">{e.access_type}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">
                        {e.status}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-500 line-clamp-1 max-w-[120px]">
                      {e.paystack_reference || "—"}
                    </td>
                    <td className="p-4 text-neutral-500">
                      {new Date(e.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center rounded-xl border border-dashed border-neutral-800 text-xs font-mono text-neutral-500">
            No student enrollments found yet. Once students complete Paystack checkout, they will appear here.
          </div>
        )}
      </div>
    </div>
  );
}
