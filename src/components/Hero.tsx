
import { useState } from "react";
import AuthModal from "@/components/AuthModal";
import VideoBackground from "@/components/hero/VideoBackground";
import HeroBadge from "@/components/hero/HeroBadge";
import HeroContent from "@/components/hero/HeroContent";
import HeroStats from "@/components/hero/HeroStats";
import HeroImage from "@/components/hero/HeroImage";

const Hero = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <VideoBackground />
        
        <div className="relative z-20 max-w-6xl mx-auto px-4 text-center">
          <HeroBadge />
          
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <HeroContent onSignInClick={() => setShowAuthModal(true)} />
              <HeroStats />
            </div>
            
            <HeroImage />
          </div>
        </div>
      </section>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
};

export default Hero;
