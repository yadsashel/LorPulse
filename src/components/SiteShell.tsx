import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 grid-bg -z-10" />
      <SiteHeader />
      <main className="pt-28">{children}</main>
      <SiteFooter />
    </div>
  );
}
