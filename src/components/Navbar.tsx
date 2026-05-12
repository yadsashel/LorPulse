"use client"; // ضروري باش يخدم الـ click
import { useState } from "react";
import lorpulseLogo from "@/assets/lorpulse-logo.png";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { label: "Studio", href: "#", active: true },
    { label: "Projects", href: "#offer" },
    { label: "Services", href: "#tech" },
    { label: "Frameworks", href: "#frameworks" },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl">
      <div className="glass-strong rounded-2xl px-6 flex items-center justify-between h-14 relative z-50">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <img src={lorpulseLogo} alt="LorPulse" width={24} height={24} />
            <span className="font-bold text-foreground tracking-tight text-sm">LORPULSE</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                  link.active
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-all"
          >
            {isOpen ? <X className="w-4 h-4 text-foreground" /> : <Menu className="w-4 h-4 text-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-background/95 backdrop-blur-xl rounded-2xl border border-white/10 p-4 md:hidden flex flex-col gap-2 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)} // كيسد المنيو ملي تكليكي على رابط
              className="px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-all text-sm font-medium"
            >
              {link.label}
            </a>
          ))}
          <button className="mt-2 w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm">
            Request Audit
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;