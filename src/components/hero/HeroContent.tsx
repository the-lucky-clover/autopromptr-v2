
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import HeroBadge from "./HeroBadge";

interface HeroContentProps {
  onSignInClick: () => void;
}

const HeroContent = ({ onSignInClick }: HeroContentProps) => {
  return (
    <div className="space-y-8 text-center">
      <HeroBadge />
      
      {/* Enhanced Hero Headline with selective gradient - 5% smaller and two lines */}
      <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-8xl font-bold leading-tight font-sans">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            Supercharge Your
          </span>
        </h1>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-8xl font-bold leading-tight bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] font-sans">
          AI Prompt Workflow
        </h1>
      </div>

      <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] font-light">
        Supercharge your productivity with intelligent prompt optimization, batch processing, and seamless deployment across all major AI platforms
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-[0_8px_32px_rgba(59,130,246,0.4)] drop-shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-300 transform hover:scale-105 hover:shadow-[0_12px_40px_rgba(59,130,246,0.6)]"
          onClick={onSignInClick}
        >
          Start Free Trial
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
        
        <Button 
          size="lg" 
          variant="outline" 
          className="border-2 border-white/30 text-white hover:text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-semibold backdrop-blur-sm drop-shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-white/50 bg-transparent"
        >
          Watch Demo
        </Button>
      </div>
    </div>
  );
};

export default HeroContent;
