
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroContentProps {
  onSignInClick: () => void;
}

const HeroContent = ({ onSignInClick }: HeroContentProps) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-6xl sm:text-8xl lg:text-9xl xl:text-[12rem] font-bold mb-8 leading-[0.85]">
        <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
          Supercharge
        </span>
        <span className="block text-stone-100 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
          Your AI Prompt Workflow
        </span>
      </h1>
      
      <p className="text-xl sm:text-2xl lg:text-3xl text-slate-200 mb-12 max-w-4xl mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
        Intelligently batch process, enhance, and deploy prompts across all major AI coding platforms AND local development tools.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-6 text-lg rounded-lg transition-all duration-300 transform hover:scale-105 shadow-[0_8px_32px_rgba(0,0,0,0.3)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)]"
        >
          Get Started Free
          <ArrowRight className="w-6 h-6 ml-3" />
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          className="border-2 border-slate-400/50 bg-transparent text-white hover:bg-white/10 px-10 py-6 text-lg rounded-lg transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.2)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)]"
          onClick={onSignInClick}
        >
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default HeroContent;
