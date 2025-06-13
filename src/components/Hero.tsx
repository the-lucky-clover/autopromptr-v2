
import { useState } from "react";
import AuthModal from "@/components/AuthModal";
import VideoBackground from "@/components/hero/VideoBackground";
import HeroBadge from "@/components/hero/HeroBadge";
import HeroContent from "@/components/hero/HeroContent";
import HeroImage from "@/components/hero/HeroImage";

const Hero = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <VideoBackground />
        
        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
          <HeroBadge />
          <HeroContent onSignInClick={() => setShowAuthModal(true)} />
          <HeroImage />
        </div>
      </section>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
};

export default Hero;
