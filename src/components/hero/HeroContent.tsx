
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
    <div className="text-center mb-12 pt-16 sm:pt-20 lg:pt-24">
      {/* Maximized hero headline with gradient only on "Supercharge" */}
      <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] font-bold mb-8 leading-[0.9] font-sans">
        <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] relative mb-2">
          Supercharge
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-2xl opacity-50"></div>
        </span>
        <span className="block text-stone-100 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] relative">
          Your AI Prompt Workflow
          <div className="absolute inset-0 bg-white/5 blur-2xl opacity-30"></div>
        </span>
      </h1>
      
      {/* Reformatted subheader with larger text and balanced line breaks */}
      <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-slate-200 mb-12 max-w-5xl mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] font-sans">
        <p className="font-medium mb-2">
          Revolutionize your AI workflow—batch, enhance,
        </p>
        <p className="font-medium">
          deploy across every platform with zero friction
        </p>
      </div>
      
      {/* CTA buttons with lightning effects but no pulse animation */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
        <Button 
          size="lg" 
          onClick={handlePrimaryClick}
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white px-12 py-7 text-lg rounded-lg transition-all duration-500 transform hover:scale-105 shadow-[0_8px_32px_rgba(0,0,0,0.3)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)] group border border-white/10"
        >
          {/* Metallic sheen overlay */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent w-1/2 h-full transform -translate-x-full -translate-y-full rotate-45 group-hover:animate-metallic-sheen pointer-events-none"></span>
          
          {/* Lightning flash overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-white/40 to-pink-400/30 pointer-events-none ${isLightningActive ? 'animate-lightning-flash' : 'opacity-0'}`}></div>
          
          {/* Continuous gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <span className="relative z-10 flex items-center">
            Get Started Free
            <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-1" />
          </span>
        </Button>
        
        <Button 
          size="lg" 
          variant="outline" 
          onClick={handleSecondaryClick}
          className="relative overflow-hidden border-2 border-slate-400/50 bg-transparent text-white hover:bg-white/10 px-12 py-7 text-lg rounded-lg transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.2)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)] group hover:border-blue-400/70 backdrop-blur-sm"
        >
          {/* Metallic sheen overlay */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent w-1/2 h-full transform -translate-x-full -translate-y-full rotate-45 group-hover:animate-metallic-sheen pointer-events-none"></span>
          
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
