
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
      <section className="relative h-screen lg:h-[90vh] flex items-center justify-center overflow-hidden">
        <VideoBackground />
        <ParticleVignette />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full py-4 lg:py-8">
          <HeroContent onSignInClick={() => setShowAuthModal(true)} />
          <div className="drop-shadow-[0_8px_32px_rgba(0,0,0,0.3)] mt-6 lg:mt-8 xl:mt-10 px-4">
            <HeroImage />
          </div>
        </div>
      </section>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
};

export default Hero;
