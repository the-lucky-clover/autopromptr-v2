
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Speedometers from "@/components/Speedometers";
import Templates from "@/components/Templates";
import SocialProof from "@/components/SocialProof";
import TrustedPlatforms from "@/components/TrustedPlatforms";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Speedometers />
      <Templates />
      <SocialProof />
      <TrustedPlatforms />
      <Pricing />
      <Footer />
      <CookieBanner />
    </div>
  );
};

export default Index;
