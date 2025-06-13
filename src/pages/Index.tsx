
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
        <Features />
        <Speedometers />
        <UseCases />
        <Templates />
        <WhitePaper />
        <SocialProof />
        <TrustedPlatforms />
        <Pricing />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
};

export default Index;
