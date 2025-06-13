
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface HeroContentProps {
  onSignInClick: () => void;
}

const HeroContent = ({ onSignInClick }: HeroContentProps) => {
  const [isGetStartedLightningActive, setIsGetStartedLightningActive] = useState(false);
  const [isSignInLightningActive, setIsSignInLightningActive] = useState(false);

  const handleGetStartedClick = () => {
    setIsGetStartedLightningActive(true);
    setTimeout(() => setIsGetStartedLightningActive(false), 800);
    onSignInClick();
  };

  const handleSignInClick = () => {
    setIsSignInLightningActive(true);
    setTimeout(() => setIsSignInLightningActive(false), 800);
    onSignInClick();
  };

  return (
    <div className="space-y-8 text-center">
      {/* Enhanced Hero Headline with selective gradient - 5% smaller and two lines */}
      <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-8xl font-bold leading-tight font-sans">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            Supercharge
          </span>
          <span className="text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"> Your AI</span>
        </h1>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-8xl font-bold leading-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] font-sans">
          Prompt Workflow
        </h1>
      </div>

      <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] font-light">
        Supercharge your productivity with intelligent prompt optimization, batch processing, and seamless deployment across all major AI platforms
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
        <Button 
          size="lg" 
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-[0_8px_32px_rgba(59,130,246,0.4)] drop-shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-300 transform hover:scale-105 hover:shadow-[0_12px_40px_rgba(59,130,246,0.6)] group"
          onClick={handleGetStartedClick}
        >
          {/* Idle sheen layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/3 h-full transform -translate-x-full rotate-45 animate-idle-metallic-sheen pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent w-1/4 h-full transform -translate-x-full rotate-47 animate-rare-glass-sheen-1 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/18 to-transparent w-1/3 h-full transform -translate-x-full rotate-43 animate-rare-glass-sheen-2 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/22 to-transparent w-1/5 h-full transform -translate-x-full rotate-49 animate-rare-glass-sheen-3 pointer-events-none"></div>
          
          {/* Hover sheen overlay */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent w-1/2 h-full transform translate-x-full -translate-y-full rotate-45 group-hover:animate-enhanced-metallic-sheen pointer-events-none"></span>
          
          {/* Lightning flash overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r from-cyan-400/40 via-white/50 to-pink-400/40 pointer-events-none ${isGetStartedLightningActive ? 'animate-lightning-flash' : 'opacity-0'}`}></div>
          
          <span className="relative z-10">Get Started</span>
          <ArrowRight className="ml-2 w-5 h-5 relative z-10" />
        </Button>
        
        <Button 
          size="lg" 
          variant="outline" 
          className="relative overflow-hidden border-2 border-white/30 text-white hover:text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-semibold backdrop-blur-sm drop-shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-white/50 bg-transparent group"
          onClick={handleSignInClick}
        >
          {/* Idle sheen layers for outline button */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-1/3 h-full transform -translate-x-full rotate-45 animate-idle-metallic-sheen pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent w-1/4 h-full transform -translate-x-full rotate-47 animate-rare-glass-sheen-1 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent w-1/3 h-full transform -translate-x-full rotate-43 animate-rare-glass-sheen-2 pointer-events-none"></div>
          
          {/* Hover sheen overlay */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/2 h-full transform translate-x-full -translate-y-full rotate-45 group-hover:animate-enhanced-metallic-sheen pointer-events-none"></span>
          
          {/* Lightning flash overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-white/30 to-pink-400/20 pointer-events-none ${isSignInLightningActive ? 'animate-lightning-flash' : 'opacity-0'}`}></div>
          
          <span className="relative z-10">Sign In</span>
        </Button>
      </div>
    </div>
  );
};

export default HeroContent;
