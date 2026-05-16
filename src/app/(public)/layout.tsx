import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { NavHistoryProvider } from "@/lib/NavHistoryContext";
import { FloatingSettings } from "@/components/FloatingSettings";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <NavHistoryProvider>
      <div className="site-shell">
        <SiteHeader />
        <main className="container page-section">
          <Breadcrumbs />
          {children}
        </main>
        <SiteFooter />
        <FloatingSettings />
      </div>
    </NavHistoryProvider>
  );
}
