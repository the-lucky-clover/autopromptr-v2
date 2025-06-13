
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Speedometers from "@/components/Speedometers";
import Templates from "@/components/Templates";
import SocialProof from "@/components/SocialProof";
import TrustedPlatforms from "@/components/TrustedPlatforms";
import WhitePaper from "@/components/WhitePaper";
import UseCases from "@/components/UseCases";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Add smooth scrolling to the document
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Header />
      <main className="w-full">
        <Hero />
        <div className="py-16 lg:py-24">
          <Features />
        </div>
        <div className="py-16 lg:py-24">
          <Speedometers />
        </div>
        <div className="py-16 lg:py-24">
          <UseCases />
        </div>
        <div className="py-16 lg:py-24">
          <Templates />
        </div>
        <div className="py-16 lg:py-24">
          <WhitePaper />
        </div>
        <div className="py-16 lg:py-24">
          <SocialProof />
        </div>
        <div className="py-16 lg:py-24">
          <TrustedPlatforms />
        </div>
        <div className="py-16 lg:py-24">
          <Pricing />
        </div>
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
};

export default Index;
