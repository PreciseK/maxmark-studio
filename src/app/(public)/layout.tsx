import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import Navigation from "@/components/layout/Navigation";
import Logo from "@/components/layout/Logo";
import ConditionalFooter from "@/components/layout/ConditionalFooter";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <Logo />
      <Navigation />
      <main id="main-content">{children}</main>
      <ConditionalFooter />
    </SmoothScrollProvider>
  );
}
