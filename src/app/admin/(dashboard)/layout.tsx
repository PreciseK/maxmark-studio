import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) redirect("/admin/setup");
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect("/admin/login");
    }

    return (
      <div className="admin-shell" style={{ display: "flex", minHeight: "100vh" }}>
        <AdminSidebar userEmail={user.email ?? ""} />
        <main className="admin-main"
          style={{
            flex: 1,
            marginLeft: "var(--admin-sidebar-width)",
            padding: "48px",
            minHeight: "100vh",
            overflowY: "auto",
          }}
        >
          {children}
        </main>
      </div>
    );
  } catch (err) {
    if (
      (err as any)?.digest?.startsWith("NEXT_REDIRECT") ||
      (err as any)?.digest === "DYNAMIC_SERVER_USAGE"
    ) {
      throw err;
    }
    console.error("DashboardLayout auth error:", err);
    redirect("/admin/login");
  }
}
