import { Link } from "react-router-dom";
import logo from "@/assets/lorpulse-logo.png";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { to: "/", label: "Home" },
    { to: "/#pricing", label: "Pricing", anchor: true },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className={`glass-strong halo rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between ${scrolled ? "shadow-[0_8px_40px_rgba(140,80,255,0.15)]" : ""}`}>
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={logo} alt="LorPulse" className="h-9 w-9 drop-shadow-[0_0_18px_rgba(168,120,255,0.55)] group-hover:drop-shadow-[0_0_28px_rgba(168,120,255,0.85)] transition-all" />
            <span className="font-display text-lg tracking-tight font-semibold">
              Lor<span className="text-[oklch(0.78_0.18_300)]">Pulse</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) =>
              n.anchor ? (
                <a key={n.to} href={n.to} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg halo-btn">
                  {n.label}
                </a>
              ) : (
                <Link key={n.to} to={n.to} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg halo-btn">
                  {n.label}
                </Link>
              )
            )}
          </nav>
          <a
            href="/#pricing"
            className="halo-btn rounded-xl px-4 py-2 text-sm font-medium bg-gradient-to-b from-[oklch(0.62_0.24_305)] to-[oklch(0.48_0.22_295)] text-white border border-white/15"
          >
            Get Leads
          </a>
        </div>
      </div>
    </header>
  );
}
