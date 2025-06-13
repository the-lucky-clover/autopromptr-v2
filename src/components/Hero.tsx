
import { useState } from "react";
import AuthModal from "@/components/AuthModal";
import VideoBackground from "@/components/hero/VideoBackground";
import ParticleVignette from "@/components/hero/ParticleVignette";
import HeroContent from "@/components/hero/HeroContent";
import HeroImage from "@/components/hero/HeroImage";

const Hero = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14 sm:pt-16">
        <VideoBackground />
        <ParticleVignette />
        
        <div className="relative z-20 max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 text-center w-full py-6 sm:py-8 lg:py-12">
          <HeroContent onSignInClick={() => setShowAuthModal(true)} />
          <div className="drop-shadow-[0_8px_32px_rgba(0,0,0,0.3)] mt-6 sm:mt-8 lg:mt-10 xl:mt-12 px-2 sm:px-4">
            <HeroImage />
          </div>
        </div>
      </section>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
};

export default Hero;
