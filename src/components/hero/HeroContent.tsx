
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroContentProps {
  onSignInClick: () => void;
}

const HeroContent = ({ onSignInClick }: HeroContentProps) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-[0.85]">
        <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
          Supercharge
        </span>
        <span className="block text-stone-100 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
          Your AI Prompt Workflow
        </span>
      </h1>
      
      <div className="text-lg sm:text-xl lg:text-2xl text-slate-200 mb-12 max-w-4xl mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
        <p className="font-medium text-xl sm:text-2xl lg:text-3xl mb-2">
          Revolutionize your AI workflow—batch, enhance, deploy
        </p>
        <p className="font-medium text-lg sm:text-xl lg:text-2xl">
          across every platform with zero friction
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
        <Button 
          size="lg" 
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-6 text-lg rounded-lg transition-all duration-300 transform hover:scale-105 shadow-[0_8px_32px_rgba(0,0,0,0.3)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)] group"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/3 h-full transform -translate-x-full rotate-45 group-hover:animate-sheen pointer-events-none"></span>
          Get Started Free
          <ArrowRight className="w-6 h-6 ml-3" />
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          className="relative overflow-hidden border-2 border-slate-400/50 bg-transparent text-white hover:bg-white/10 px-10 py-6 text-lg rounded-lg transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.2)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)] group"
          onClick={onSignInClick}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/3 h-full transform -translate-x-full rotate-45 group-hover:animate-sheen pointer-events-none"></span>
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default HeroContent;
