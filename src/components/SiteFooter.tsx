import { Link } from "react-router-dom";
import logo from "@/assets/lorpulse-logo.png";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="LorPulse" className="h-8 w-8 drop-shadow-[0_0_18px_rgba(168,120,255,0.55)]" />
              <span className="font-display text-lg font-semibold">Lor<span className="text-[oklch(0.78_0.18_300)]">Pulse</span></span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Specialized AI-enriched B2B lead acquisition pipelines. Niche-targeted, intent-driven, autonomously delivered.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground">Product</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="/#pricing" className="hover:text-foreground text-muted-foreground">Pricing</a></li>
              <li><a href="/#features" className="hover:text-foreground text-muted-foreground">Capabilities</a></li>
              <li><Link to="/contact" className="hover:text-foreground text-muted-foreground">Contact Sales</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-foreground text-muted-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground text-muted-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-3 border-t border-white/5 pt-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} LorPulse. All rights reserved.</p>
          <p className="opacity-70">Powered by autonomous AI enrichment pipelines.</p>
        </div>
      </div>
    </footer>
  );
}
