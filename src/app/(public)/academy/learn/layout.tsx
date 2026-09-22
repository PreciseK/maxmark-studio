import { checkCurrentUserAcademyAccess } from "@/lib/academy/access";
import Link from "next/link";

export default async function AcademyLearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const access = await checkCurrentUserAcademyAccess();

  // If user does not have active access, display a paywall barrier
  if (!access.hasAccess) {
    return (
      <div className="min-h-screen bg-black text-white pt-28 pb-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-neutral-950 border border-white/15 rounded-2xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 rounded-full bg-[#E3FF39]/10 border border-[#E3FF39]/30 text-[#E3FF39] flex items-center justify-center mx-auto text-2xl font-mono font-bold">
            🔒
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E3FF39]">
              STUDENT PORTAL
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
              Enrollment Required
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              This masterclass section is reserved for enrolled students and active members of Maxmark Animations Academy.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/academy#pricing"
              className="w-full py-3.5 rounded-xl bg-[#E3FF39] text-black font-extrabold uppercase text-xs tracking-wider hover:bg-[#d6f030] transition-transform active:scale-95 block shadow-lg shadow-[#E3FF39]/20"
            >
              Choose An Enrollment Plan →
            </Link>

            <Link
              href="/admin/login"
              className="w-full py-3 rounded-xl bg-white/5 border border-white/15 text-white font-bold uppercase text-xs tracking-wider hover:bg-white/10 transition-colors block"
            >
              Already Enrolled? Login
            </Link>
          </div>

          <p className="text-[11px] font-mono text-neutral-500">
            Need help? Contact support@maxmarkstudio.com.ng
          </p>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen bg-black text-white">{children}</div>;
}
