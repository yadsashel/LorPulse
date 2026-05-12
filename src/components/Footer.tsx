import lorpulseLogo from "@/assets/lorpulse-logo.png";

const Footer = () => {
  // داتا ديال الروابط باش يكون الكود نقي وساهل فـ التعديل
  const platformLinks = [
    { label: "Studio", href: "#" },
    { label: "Projects", href: "#offer" },
    { label: "Services", href: "#tech" },
    { label: "Frameworks", href: "#frameworks" },
  ];

  const companyLinks = [
    { label: "About", href: "#" },
    { label: "Security", href: "#" },
    { label: "Contact", href: "javascript:void(0)", isContact: true }, // رابط خاص للـ Chat
  ];

  const handleContactClick = () => {
    // هادي كاتفتح الـ Chatbot أوتوماتيكياً ملي الكليان يكليكي على Contact
    // تأكد بلي الـ State ديال الـ Chatbot سميتها 'open' وتقدر تحكم فيها من هنا
    // أو ببساطة كانديرو Scroll لجهة البوطون ديال الشات
    const chatButton = document.querySelector('button[className*="fixed bottom-6 right-6"]') as HTMLButtonElement;
    if (chatButton) chatButton.click();
  };

  return (
    <footer className="py-16 border-t border-border/30 bg-black/20">
      <div className="section-container">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Intro */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={lorpulseLogo} alt="LorPulse" width={28} height={28} loading="lazy" />
              <span className="font-bold text-foreground tracking-widest text-sm">LORPULSE</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              The engineering partner that deploys autonomous agents into your fortress. 
              Data privacy first. Enterprise-grade execution.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 font-mono tracking-tighter">Platform</h4>
            <div className="space-y-3">
              {platformLinks.map((link) => (
                <a 
                  key={link.label} 
                  href={link.href} 
                  className="block text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 font-mono tracking-tighter">Company</h4>
            <div className="space-y-3">
              {companyLinks.map((link) => (
                <a 
                  key={link.label} 
                  href={link.href}
                  onClick={link.isContact ? handleContactClick : undefined}
                  className="block text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/20">
          <p className="text-xs text-muted-foreground font-mono">
            © {new Date().getFullYear()} LorPulse Systems. <span className="text-primary/40 text-[10px]">Neural-link active.</span>
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a key={item} href="#LegalSection" className="text-xs text-muted-foreground hover:text-primary transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;