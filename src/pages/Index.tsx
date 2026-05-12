import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TruthSection from "@/components/TruthSection";
import OfferSection from "@/components/OfferSection";
import TechSection from "@/components/TechSection";
import FrameworksSection from "@/components/FrameworksSection";
import ChatBot from "@/components/ChatBot";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";
import LegalSection from "@/components/LegalSection";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <div id="truth"><TruthSection /></div>
    <div id="offer"><OfferSection /></div>
    <div id="tech"><TechSection /></div>
    <div id="frameworks"><FrameworksSection /></div>
    <div id="pricing"><PricingSection /></div>
    <div id="legal"><LegalSection/></div>
    <Footer />
    <ChatBot />
  </div>
);

export default Index;
