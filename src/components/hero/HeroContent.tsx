
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroContentProps {
  onSignInClick: () => void;
}

const HeroContent = ({ onSignInClick }: HeroContentProps) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
        <span className="block">Supercharge Your</span>
        <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          AI Prompt Workflow
        </span>
      </h1>
      
      <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
        Intelligently batch process, enhance, and deploy prompts across all major AI coding platforms AND local development tools.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
          Get Started Free
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          className="border-2 border-slate-400/50 bg-transparent text-white hover:bg-white/10 px-8 py-4 rounded-lg transition-all duration-300"
          onClick={onSignInClick}
        >
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default HeroContent;
