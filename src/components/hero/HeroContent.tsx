
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface HeroContentProps {
  onSignInClick: () => void;
}

const HeroContent = ({ onSignInClick }: HeroContentProps) => {
  const [isLightningActive, setIsLightningActive] = useState(false);
  const [isSecondaryLightningActive, setIsSecondaryLightningActive] = useState(false);

  const handlePrimaryClick = () => {
    setIsLightningActive(true);
    setTimeout(() => setIsLightningActive(false), 800);
  };

  const handleSecondaryClick = () => {
    setIsSecondaryLightningActive(true);
    setTimeout(() => setIsSecondaryLightningActive(false), 800);
    onSignInClick();
  };

  return (
    <div className="text-center mb-8 lg:mb-12 pt-16 sm:pt-20 lg:pt-24">
      {/* Hero headline - FORCED 2 lines with optimized responsive sizing */}
      <h1 className="font-bold mb-6 lg:mb-8 leading-[0.8] font-sans">
        {/* Line 1: "Supercharge Your" */}
        <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-8xl mb-1">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
            Supercharge
          </span>{" "}
          <span className="text-stone-100 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
            Your
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-2xl opacity-30 pointer-events-none"></div>
        </div>
        {/* Line 2: "AI Prompt Workflow" */}
        <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-8xl text-stone-100 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] relative">
          AI Prompt Workflow
          <div className="absolute inset-0 bg-white/5 blur-2xl opacity-30 pointer-events-none"></div>
        </div>
      </h1>
      
      {/* More pragmatic subheadline - smaller and benefit-focused */}
      <div className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl text-slate-200 mb-8 lg:mb-12 max-w-4xl mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] font-sans px-4">
        <p className="font-medium mb-2 text-slate-100">
          Automate prompt optimization and deployment.
        </p>
        <p className="font-medium text-slate-300">
          Scale AI workflows across every platform.
        </p>
      </div>
      
      {/* CTA buttons with improved responsive sizing */}
      <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center px-4">
        <Button 
          size="lg" 
          onClick={handlePrimaryClick}
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white px-8 lg:px-12 py-6 lg:py-7 text-base lg:text-lg rounded-lg transition-all duration-500 transform hover:scale-105 shadow-[0_8px_32px_rgba(0,0,0,0.3)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)] group border border-white/10 w-full sm:w-auto"
        >
          {/* Enhanced metallic sheen overlay - upper-right to lower-left */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90 to-transparent w-1/2 h-full transform translate-x-full -translate-y-full rotate-45 group-hover:animate-enhanced-metallic-sheen pointer-events-none"></span>
          
          {/* Lightning flash overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-white/40 to-pink-400/30 pointer-events-none ${isLightningActive ? 'animate-lightning-flash' : 'opacity-0'}`}></div>
          
          {/* Continuous gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <span className="relative z-10 flex items-center justify-center">
            Get Started Free
            <ArrowRight className="w-5 lg:w-6 h-5 lg:h-6 ml-2 lg:ml-3 transition-transform group-hover:translate-x-1" />
          </span>
        </Button>
        
        <Button 
          size="lg" 
          variant="outline" 
          onClick={handleSecondaryClick}
          className="relative overflow-hidden border-2 border-slate-400/50 bg-transparent text-white hover:bg-white/10 px-8 lg:px-12 py-6 lg:py-7 text-base lg:text-lg rounded-lg transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.2)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)] group hover:border-blue-400/70 backdrop-blur-sm w-full sm:w-auto"
        >
          {/* Enhanced metallic sheen overlay - upper-right to lower-left */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent w-1/2 h-full transform translate-x-full -translate-y-full rotate-45 group-hover:animate-enhanced-metallic-sheen pointer-events-none"></span>
          
          {/* Lightning flash overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r from-blue-400/30 via-white/30 to-purple-400/30 pointer-events-none ${isSecondaryLightningActive ? 'animate-lightning-flash' : 'opacity-0'}`}></div>
          
          {/* Continuous gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <span className="relative z-10">Sign In</span>
        </Button>
      </div>
    </div>
  );
};

export default HeroContent;
