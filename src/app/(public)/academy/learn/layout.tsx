import { checkCurrentUserAcademyAccess } from "@/lib/academy/access";

export default async function AcademyLearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-base)",
        color: "var(--fg-primary)",
      }}
    >
      {children}
    </div>
  );
}
